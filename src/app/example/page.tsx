"use client";

import { useState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignupForm() {
  const [toast, setToast] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Dark mode state

  const onSubmit = (data: any) => {
    data.preventDefault()
    console.log(data);
  };
  
  const switchToLogin = (data: any) => {
    data.preventDefault()
    console.log("Switching to login...");
  };

  return (
    <div
      className={`h-screen grid place-content-center ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 border rounded-md text-sm font-semibold transition 
            hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          {isDarkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>
      </div>

      <div
        className={`flex border rounded p-6 w-96 flex-col justify-center shadow-lg transition ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-gray-100 border-gray-300 text-gray-900"
        }`}
      >
        {toast && (
          <div
            className={`p-4 rounded fixed top-4 right-4 border shadow ${
              isDarkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            }`}
          >
            {toastMessage}
          </div>
        )}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Create your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="fullName" className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                Full Name
              </Label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="fullName"
                  id="fullName"
                  required
                  className={`w-full p-2 rounded border focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  }`}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            {`<Message>Don't fuck with <b>me!</b></Message>`}

            <div>
              <Label htmlFor="email" className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                Email address
              </Label>
              <div className="mt-2">
                <Input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  className={`w-full p-2 rounded border focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  }`}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                Password
              </Label>
              <div className="mt-2">
                <Input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  className={`w-full p-2 rounded border focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  }`}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className={`w-full font-semibold border rounded-md p-2 transition ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    : "bg-blue-600 border-blue-500 text-white hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Signing you up..." : "Sign up"}
              </Button>
            </div>
            <p className={`text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Already have an account?{" "}
              <button
                onClick={switchToLogin}
                className={`font-bold underline ${
                  isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-800 hover:text-black"
                }`}
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
