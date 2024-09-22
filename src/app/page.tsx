import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Cars from "@/components/Cars/Cars";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Cars />
      </DefaultLayout>
    </>
  );
}
