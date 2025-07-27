# Invoicify

🚀 Effortless Invoicing, Simplified Payments.

✨ **About Invoicify**

Invoicify is a modern, robust invoicing platform designed to streamline billing, track payments, and manage clients with ease. Perfect for freelancers and small businesses.

## 🌟 Key Features

-   **Customizable Invoice Templates**: Create professional, branded invoices that reflect your business identity.
-   **Client & Item Management**: Easily manage your clients and maintain a catalog of your products and services.
-   **Payment Tracking & Reminders**: Keep a close eye on invoice statuses and send automated reminders for overdue payments.
-   **Multi-Currency Support**: Handle transactions in various currencies to cater to a global clientele.
-   **Reporting & Analytics**: Gain valuable insights into your financial performance with detailed reports.

## 💻 Tech Stack

-   **Frontend**: [React](https://reactjs.org/), [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
-   **Backend**: [Node.js](https://nodejs.org/) (via Next.js API Routes), [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **Deployment**: [Vercel](https://vercel.com/) (Frontend), [Railway](https://railway.app/)/[Render](https://render.com/)/[Supabase](https://supabase.com/) (Backend/DB)

## ⚙️ Getting Started (Local Development)

Follow these steps to get your development environment set up:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/invoicify.git
    cd invoicify
    ```
    > **Note**: Make sure to replace `your-username` with your actual GitHub username if you've forked the repository.

2.  **Install dependencies:**
    We recommend using `pnpm` for package management.
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add the following variables. You'll need a PostgreSQL database URL.
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    NEXTAUTH_SECRET="your-super-secret-nextauth-secret"
    ```
    > **Security Note**: `NEXTAUTH_SECRET` can be any random string. You can generate one using `openssl rand -base64 32` on a Unix-like system.

4.  **Run database migrations:**
    This will set up your database schema.
    ```bash
    pnpm prisma migrate dev --name init
    ```

5.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    Your application should now be running at [http://localhost:3000](http://localhost:3000).

## 🤝 Contributing

We welcome contributions from the community! If you'd like to contribute, please follow these steps:

1.  **Fork** the repository on GitHub.
2.  **Create a new branch** for your feature or bug fix. (`git checkout -b feature/your-feature-name`)
3.  **Make your changes** and commit them with clear, descriptive messages.
4.  **Push your branch** to your fork.
5.  **Open a Pull Request** to the `main` branch of the original repository.

We'll review your PR as soon as possible. Thank you for your interest in improving Invoicify!

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

Have questions or suggestions? Feel free to open an issue on the GitHub repository.

---

Thank you for checking out Invoicify!