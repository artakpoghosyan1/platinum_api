import AboutForm from "@/components/About/About";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const About = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="About" />
      <AboutForm />
    </DefaultLayout>
  );
};

export default About;
