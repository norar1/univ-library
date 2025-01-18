"use client"
// pages/sign-in.tsx

import AuthForm from "@/components/AuthForm";
import { signInWithCredential } from "@/lib/action/auth";

import { signInSchema } from "@/lib/validations";


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
