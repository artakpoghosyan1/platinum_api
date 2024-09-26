import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Cars from "@/components/Cars/Cars";
import { commonMetadata } from "@/config/metadata";
import { Metadata } from "next";

export const metadata: Metadata = commonMetadata;

export default function Dashboard() {
  return (
    <>
      <DefaultLayout>
        <Cars />
      </DefaultLayout>
    </>
  );
}
