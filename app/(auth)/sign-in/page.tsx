"use client"
// pages/sign-in.tsx

import AuthForm from "@/components/AuthForm";
import { signInSchema } from "@/lib/validations";
import { signInWithCredential } from "@/lib/action/auth";

const Page = () => {
  return (
    <AuthForm
      type="SIGN_IN"
      schema={signInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={signInWithCredential} 
    />
  );
};


export default Page;
