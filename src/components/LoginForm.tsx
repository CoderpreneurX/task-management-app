"use client";

import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/utils/authApi";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { register, handleSubmit } = useForm();
  const [toast, setToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isLoading, setLoading] = useState(false)

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: any) => {
      setToast(true)
      setToastMessage(data.message)
      setLoading(false)
      console.log("Logging user", data)
      router.push("/")
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

  const switchToRegister = (e: any) => {
    e.preventDefault()
    router.push("/signup")
  }

  return (
    <div className="flex border bg-white rounded p-6 flex-col justify-center">
      {toast && <div className="p-4 bg-white rounded fixed top-4 right-4 border shadow">{toastMessage}</div>}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={onSubmit}>
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
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
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
            <Button type="submit" className="w-full">
              {isLoading? "Logging in..." : "Log in"}
            </Button>
          </div>
          <p>Don't have an account? <button onClick={switchToRegister} className="text-underline font-bold">Register</button></p>
        </form>
      </div>
    </div>
  );
}
