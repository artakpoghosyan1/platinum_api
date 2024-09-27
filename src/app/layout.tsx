"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { UserProvider } from "@/contexts/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="h-full dark:bg-boxdark-2 dark:text-bodydark">
          <UserProvider>
            {loading ? (
              <Loader fullScreen />
            ) : (
              <ReactQueryProvider>{children}</ReactQueryProvider>
            )}
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
