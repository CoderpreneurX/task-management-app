"use client";

import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/utils/authApi";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [formData, setFormData] = useState({ email: "", password: "", fullName: "" });
  const { register, handleSubmit } = useForm();
  const [toast, setToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isLoading, setLoading] = useState(false)
  const submitButton = useRef<HTMLButtonElement>(null);
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data: any) => {
      setToast(true)
      setToastMessage(data.message)
      setLoading(false)
      router.push('/login')
      console.log("Logging user", data)
    },
    onError: (error: any) => {
      console.log(error.response?.data?.message)
      setToast(true)
      setToastMessage(error.response?.data?.message)
      setLoading(false)
    }
  });

  const onSubmit = (e: any) => {
    if (!isLoading) {
      e.preventDefault();
      setLoading(true)
      mutation.mutate(formData);
    }
  }

  const switchToLogin = (e: any) => {
    e.preventDefault()
    router.push("/login")
  }

  return (
    <div className="flex border bg-white rounded p-6 w-96 flex-col justify-center">
      {toast && <div className="p-4 bg-white rounded fixed top-4 right-4 border shadow">{toastMessage}</div>}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <div className="mt-2">
              <Input
                type="text"
                name="fullName"
                id="fullName"
                required
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="mt-2">
              <Input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="mt-2">
              <Input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Button ref={submitButton} type="submit" className="w-full">
              {isLoading ? "Signing you up..." : "Sign in"}
            </Button>
          </div>
          <p className="text-center">Already have an account? <button onClick={switchToLogin} className="font-bold underline">Login</button></p>
        </form>
      </div>
    </div>
  );
}
