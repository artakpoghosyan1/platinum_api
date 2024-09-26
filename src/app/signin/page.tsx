import SignIn from "@/components/Signin/Signin";
import { Metadata } from "next";
import { commonMetadata } from "@/config/metadata";

export const metadata: Metadata = commonMetadata;

const SignInPage = () => {
  return <SignIn />;
};

export default SignInPage;
