import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { StoreProvider } from "@/stores/StoreProvider";
import QueryProvider from "@/lib/QueryProvider";
import Example from "./example/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Task Management App",
  description: "An application for managing tasks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-slate-100 ${inter.className}`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
