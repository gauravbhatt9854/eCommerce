"use client";
import { SignUp } from "@clerk/nextjs";

const SignupPage = () => {

  return <div className="flex justify-center items-center h-screen">
    <SignUp />
  </div>
}

export default SignupPage;
