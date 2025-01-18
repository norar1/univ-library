"use client"
import AuthForm from "@/components/AuthForm"
import { signUpScehma } from "@/lib/validations"
import { signUp } from "@/lib/action/auth"

const page = () => {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpScehma}
      defaultValues={{
        email: "",
        password: "",
        fullname: "",
        universityId: 0,
        universityCard: "",
      }} 
      onSubmit={signUp}
    />
  )
}

export default page
