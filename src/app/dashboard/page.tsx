import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Cars from "@/components/Cars/Cars";

export const metadata: Metadata = {
  title: "Carmark admin panel",
  description:
    "This is a carmark admin panel where admin can add, edit, delete cars and add about the company information",
};

export default function Dashboard() {
  return (
    <>
      <DefaultLayout>
        <Cars />
      </DefaultLayout>
    </>
  );
}
