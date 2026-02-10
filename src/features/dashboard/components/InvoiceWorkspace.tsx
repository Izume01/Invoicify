"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Download,
  Eye,
  FileJson,
  Loader2,
  Paperclip,
  RefreshCw,
  Send,
  Sparkles,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import InvoiceDocument from "@/features/invoices/components/InvoiceDocument";
import InvoiceList from "@/features/invoices/components/InvoiceList";
import InvoicePreviewModal from "@/features/invoices/components/InvoicePreviewModal";
import { downloadInvoiceJson, downloadInvoicePdf } from "@/features/invoices/lib/download";
import type { InvoiceDetail } from "@/types/invoice";

const MAX_TEXT_BYTES = 100_000;

type UpdateSource = "llm" | "fallback";

async function fileToText(file: File): Promise<string> {
  const textLikeTypes = [
    "text/",
    "application/json",
    "application/xml",
    "application/csv",
  ];

  const isTextType = textLikeTypes.some((type) => file.type.startsWith(type));
  const isTextExtension = /\.(txt|md|csv|json|xml|html?)$/i.test(file.name);

  if (!isTextType && !isTextExtension) {
    return `Uploaded file: ${file.name}`;
  }

  const content = await file.text();
  const trimmed = content.slice(0, MAX_TEXT_BYTES);
  return `File: ${file.name}\n${trimmed}`;
}

export default function InvoiceWorkspace() {
  const searchParams = useSearchParams();
  const editInvoiceId = searchParams.get("edit") ?? "";

  const [prompt, setPrompt] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [editInstruction, setEditInstruction] = useState("");

  const [activeInvoice, setActiveInvoice] = useState<InvoiceDetail | null>(null);
  const [listRefreshToken, setListRefreshToken] = useState(0);

  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplyingEdit, setIsApplyingEdit] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [progressEvents, setProgressEvents] = useState<string[]>([]);
  const [lastUpdateSource, setLastUpdateSource] = useState<UpdateSource | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadInvoicePreview = useCallback(async (invoiceId: string) => {
    try {
      setIsLoadingPreview(true);

      const response = await fetch(`/api/invoice/${invoiceId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Unable to load invoice preview.");
      }

      const payload = (await response.json()) as { invoice: InvoiceDetail };
      setActiveInvoice(payload.invoice);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load invoice preview.";
      toast.error(message);
    } finally {
      setIsLoadingPreview(false);
    }
  }, []);

  useEffect(() => {
    if (!editInvoiceId) {
      return;
    }

    void loadInvoicePreview(editInvoiceId);
  }, [editInvoiceId, loadInvoicePreview]);

  const clearComposer = () => {
    setPrompt("");
    setPastedText("");
    setAttachments([]);
    setProgressEvents([]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const appendFiles = (files: FileList | File[]) => {
    const nextFiles = Array.from(files);
    if (nextFiles.length === 0) return;

    setAttachments((prev) => [...prev, ...nextFiles]);
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files.length > 0) {
      appendFiles(event.dataTransfer.files);
    }

    const text = event.dataTransfer.getData("text/plain");
    if (text) {
      setPastedText((prev) => [prev, text].filter(Boolean).join("\n"));
    }
  };

  const handlePaste: React.ClipboardEventHandler<HTMLTextAreaElement> = (event) => {
    const pasted = event.clipboardData.getData("text/plain");
    if (pasted.trim()) {
      setPastedText((prev) => [prev, pasted.trim()].filter(Boolean).join("\n"));
    }

    if (event.clipboardData.files.length > 0) {
      appendFiles(event.clipboardData.files);
    }
  };

  const refreshInvoiceList = () => {
    setListRefreshToken((prev) => prev + 1);
  };

  const handleResetWorkspace = () => {
    clearComposer();
    setEditInstruction("");
    setLastUpdateSource(null);
  };

  const handleGenerate = async () => {
    const hasPrompt = prompt.trim().length > 0;
    const hasPastedText = pastedText.trim().length > 0;
    const hasAttachments = attachments.length > 0;

    if (!hasPrompt && !hasPastedText && !hasAttachments) {
      toast.error("Add a prompt, pasted text, or attachment to generate an invoice.");
      return;
    }

    setIsGenerating(true);
    setProgressEvents([]);

    try {
      const attachmentTextChunks = await Promise.all(attachments.map((file) => fileToText(file)));
      const extractedText = [pastedText.trim(), ...attachmentTextChunks].filter(Boolean).join("\n\n");

      const response = await fetch("/api/invoice/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim() || "Generate an invoice from the attached details.",
          extractedText,
          invoiceId: editInvoiceId || undefined,
          stream: true,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Invoice generation failed.");
      }

      if (!response.body) {
        throw new Error("No response stream available.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let generatedInvoice: InvoiceDetail | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const messages = buffer.split("\n\n");
        buffer = messages.pop() ?? "";

        for (const message of messages) {
          const line = message
            .split("\n")
            .find((entry) => entry.startsWith("data: "));

          if (!line) {
            continue;
          }

          const payload = JSON.parse(line.slice(6)) as {
            type?: string;
            message?: string;
            invoice?: InvoiceDetail;
          };

          if (payload.type === "progress" && payload.message) {
            const progressMessage = payload.message;
            setProgressEvents((prev) => [...prev, progressMessage]);
          }

          if (payload.type === "error") {
            throw new Error(payload.message ?? "Invoice generation failed.");
          }

          if (payload.type === "result") {
            setProgressEvents((prev) => [...prev, "Invoice generated."]);

            if (payload.invoice) {
              generatedInvoice = payload.invoice;
            }
          }
        }
      }

      if (generatedInvoice) {
        setActiveInvoice(generatedInvoice);
        toast.success("Invoice generated.");
      }

      refreshInvoiceList();
      clearComposer();
      setLastUpdateSource(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invoice generation failed.";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadJson = () => {
    if (!activeInvoice) {
      return;
    }

    try {
      downloadInvoiceJson(activeInvoice);
      toast.success("Invoice JSON downloaded.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to download invoice JSON.";
      toast.error(message);
    }
  };

  const handleDownloadPdf = () => {
    if (!activeInvoice) {
      return;
    }

    try {
      const didStartDownload = downloadInvoicePdf(activeInvoice);
      if (!didStartDownload) {
        toast.error("Pop-up blocked. Please allow pop-ups for this site to download PDFs.");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to download invoice PDF.";
      toast.error(message);
    }
  };

  const handleApplyEdit = async () => {
    if (!activeInvoice) {
      toast.error("Select or generate an invoice before applying edits.");
      return;
    }

    if (!editInstruction.trim()) {
      toast.error("Enter an edit instruction.");
      return;
    }

    try {
      setIsApplyingEdit(true);

      const response = await fetch("/api/invoice/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceId: activeInvoice.id,
          instruction: editInstruction.trim(),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Unable to apply invoice update.");
      }

      const payload = (await response.json()) as {
        invoice: InvoiceDetail;
        updateSource?: UpdateSource;
        message?: string;
      };

      setActiveInvoice(payload.invoice);
      setLastUpdateSource(payload.updateSource ?? null);
      void loadInvoicePreview(payload.invoice.id);
      refreshInvoiceList();

      if (payload.message) {
        toast(payload.message);
        return;
      }

      setEditInstruction("");
      toast.success("Invoice updated.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to apply invoice update.";
      toast.error(message);
    } finally {
      setIsApplyingEdit(false);
    }
  };

  const activeInstructions = useMemo(() => {
    if (editInvoiceId) {
      return "Edit mode is active. Submitting creates a new snapshot version of this invoice.";
    }

    return "Describe an invoice in plain text. Example: Invoice for Acme, 2 logo revisions x3 @ 120, discount 10%, tax 8%.";
  }, [editInvoiceId]);

  return (
    <div id="invoice-workspace" className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-700">
      <div className="grid items-start gap-4 xl:grid-cols-12 xl:gap-5">
        <Card className="surface-panel flex min-w-0 flex-col rounded-3xl xl:col-span-7">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl border border-primary/35 bg-primary/16 text-primary">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-lg">Invoice Generator</CardTitle>
                  <CardDescription className="mt-1 text-sm">{activeInstructions}</CardDescription>
                </div>
              </div>
              {editInvoiceId ? <Badge variant="default">Editing Mode</Badge> : null}
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="surface-soft rounded-xl p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Context Files
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">{attachments.length}</p>
              </div>
              <div className="surface-soft rounded-xl p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Progress Events
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">{progressEvents.length}</p>
              </div>
              <div className="surface-soft rounded-xl p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Current Mode
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {editInvoiceId ? "Edit existing" : "Create new"}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe line items, quantity, discounts, tax, client details, and terms..."
                className="min-h-[240px] resize-none rounded-2xl bg-input/72 p-4 text-base"
              />
              <div className="pointer-events-none absolute bottom-3 right-3 rounded-md border border-border/70 bg-card/70 px-2 py-0.5 text-[11px] text-muted-foreground">
                AI-assisted drafting
              </div>
            </div>

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`rounded-2xl border p-5 transition-[border-color,background-color] duration-200 ${
                isDragging
                  ? "border-primary/45 bg-primary/12"
                  : "border-border/80 bg-card/52 hover:border-primary/32 hover:bg-card/72"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Attach context files</p>
                  <p className="text-xs text-muted-foreground">
                    Drag files here or upload notes to enrich extraction context.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg"
                >
                  <Upload className="mr-1.5 size-3.5" />
                  Upload
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={(event) => {
                  if (event.target.files) {
                    appendFiles(event.target.files);
                    event.target.value = "";
                  }
                }}
              />

              {attachments.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-lg border border-border/80 bg-input/65 px-3 py-2 text-sm text-foreground/90"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <Paperclip className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        className="rounded p-0.5 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="size-4" />
                        <span className="sr-only">Remove file</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {pastedText.trim() ? (
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Pasted Content
                </p>
                <p className="line-clamp-4 whitespace-pre-wrap rounded-lg border border-border/75 bg-input/70 p-2 font-mono text-xs text-foreground/85">
                  {pastedText}
                </p>
              </div>
            ) : null}

            {progressEvents.length > 0 ? (
              <div className="rounded-2xl border border-primary/35 bg-primary/11 p-4">
                <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  <Loader2 className="size-3.5 animate-spin" />
                  Processing
                </p>
                <div className="space-y-1.5">
                  {progressEvents.map((event, index) => (
                    <p key={`${event}-${index}`} className="flex items-center gap-2 text-sm text-foreground/88">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {event}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>

          <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={handleResetWorkspace}>
                <RefreshCw className="mr-1.5 size-3.5" />
                Reset
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={refreshInvoiceList}>
                Refresh List
              </Button>
            </div>

            <Button type="button" onClick={handleGenerate} disabled={isGenerating} className="min-w-[160px]">
              {isGenerating ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
              {isGenerating ? "Generating..." : editInvoiceId ? "Save Snapshot" : "Generate Invoice"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="surface-panel flex min-w-0 flex-col rounded-3xl xl:col-span-5">
          <CardHeader className="space-y-2 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-primary/35 bg-primary/16 text-primary">
                <Eye className="size-4" />
              </div>
              <div>
                <CardTitle className="text-lg">Live Preview</CardTitle>
                <CardDescription className="mt-1 text-sm">
                  {activeInvoice
                    ? `${activeInvoice.invoiceNumber} · ${activeInvoice.billToName}`
                    : "Preview the generated document in real time"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 pt-0">
            {isLoadingPreview ? (
              <div className="flex h-[500px] items-center justify-center rounded-2xl border border-border/80 bg-card/55">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="size-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Rendering preview...</p>
                </div>
              </div>
            ) : activeInvoice ? (
              <div className="relative h-[560px] overflow-hidden rounded-2xl border border-border/80 bg-background/65">
                <div className="absolute inset-0 flex justify-center overflow-auto py-8">
                  <div className="h-fit origin-top scale-[0.55]">
                    <InvoiceDocument invoice={activeInvoice} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-[500px] flex-col items-center justify-center gap-4 rounded-2xl border border-border/80 bg-card/55 p-8 text-center">
                <div className="rounded-full border border-border/75 bg-input/75 p-4 text-muted-foreground">
                  <FileJson className="size-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-foreground">No invoice selected</p>
                  <p className="mx-auto max-w-xs text-sm text-muted-foreground">
                    Generate an invoice or pick one from history to load preview controls.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDownloadPdf}
                disabled={!activeInvoice}
              >
                <Download className="mr-2 size-4" />
                PDF
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDownloadJson}
                disabled={!activeInvoice}
              >
                <FileJson className="mr-2 size-4" />
                JSON
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full sm:col-span-2 lg:col-span-1"
                onClick={() => setIsPreviewModalOpen(true)}
                disabled={!activeInvoice}
              >
                <Eye className="mr-2 size-4" />
                Full View
              </Button>
            </div>

            <div className="surface-soft space-y-3 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <WandSparkles className="size-3.5 text-primary" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Quick Edit
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  value={editInstruction}
                  onChange={(event) => setEditInstruction(event.target.value)}
                  placeholder="e.g., 'Apply 10% discount and set tax to 8%'"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void handleApplyEdit();
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => void handleApplyEdit()}
                  disabled={!activeInvoice || isApplyingEdit || !editInstruction.trim()}
                >
                  {isApplyingEdit ? (
                    <Loader2 className="mr-2 size-3.5 animate-spin" />
                  ) : (
                    <Send className="mr-2 size-3.5" />
                  )}
                  Apply Modification
                </Button>
              </div>

              {lastUpdateSource ? (
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  <span>Source: {lastUpdateSource === "llm" ? "AI model" : "Rule engine"}</span>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <InvoiceList
        refreshToken={listRefreshToken}
        activeInvoiceId={activeInvoice?.id ?? null}
        onPreview={(invoiceId) => {
          void loadInvoicePreview(invoiceId);
        }}
      />

      <InvoicePreviewModal
        open={isPreviewModalOpen}
        invoice={activeInvoice}
        onClose={() => setIsPreviewModalOpen(false)}
        onDownloadPdf={handleDownloadPdf}
        onDownloadJson={handleDownloadJson}
      />
    </div>
  );
}
