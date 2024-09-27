import AboutForm from "@/components/About/About";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import { commonMetadata } from "@/config/metadata";

export const metadata: Metadata = commonMetadata;

const About = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="About" />
      <AboutForm />
    </DefaultLayout>
  );
};

export default About;
