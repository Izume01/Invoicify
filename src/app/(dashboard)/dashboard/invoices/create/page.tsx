import { redirect } from "next/navigation";

export default function LegacyCreateInvoicePage() {
  redirect("/dashboard#invoice-workspace");
}
