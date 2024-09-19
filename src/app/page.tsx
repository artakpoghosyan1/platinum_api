import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Cars from "@/components/Cars/Cars";
import ReactQueryProvider from "@/lib/ReactQueryProvider";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        {/*<ECommerce />*/}
        <ReactQueryProvider>
          <Cars />
        </ReactQueryProvider>
      </DefaultLayout>
    </>
  );
}
