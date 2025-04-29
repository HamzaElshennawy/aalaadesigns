"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useTheme } from "next-themes";
import { XCircle, X } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUser } from "@/app/contexts/UserContext";

export default function Signin() {
  const { theme } = useTheme();
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const { setUser } = useUser();
  const [IsSigningin, setIsSigningin] = useState(false);

  const closeAlert = useCallback(() => {
    setError(false);
    setFormError("");
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAlert();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeAlert]);

  const handleSignIn = useCallback(() => {
    if (!emailValue || !passwordValue) {
      setFormError("Please fill in both email and password fields.");

      return;
    }
    signinUser(emailValue, passwordValue);
  }, [emailValue, passwordValue]);

  useEffect(() => {
    const handleEnterKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSignIn();
      }
    };

    window.addEventListener("keydown", handleEnterKeyDown);

    return () => {
      window.removeEventListener("keydown", handleEnterKeyDown);
    };
  }, [handleSignIn]);

  async function signinUser(email: string, password: string): Promise<void> {
    setIsSigningin(true);
    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(result[0]));
        setUser(result[0]);
        setError(false);
        setFormError("");
        router.push("../");
      } else {
        setError(true);
        setFormError(result.message || "Authentication failed");
      }
    } catch (error) {
      setError(true);
      setFormError("An unexpected error occurred");
    } finally {
      setIsSigningin(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="flex justify-center items-center min-h-screen p-4">
        <Card className="w-full max-w-6xl shadow-xl">
          <CardBody className="p-0">
            <div className="flex flex-col md:flex-row min-h-[600px]">
              <div className="flex-1 flex flex-col justify-center items-center p-8 dark:bg-gray-800">
                <Image
                  alt="AALAA Designs Logo"
                  className="w-48 h-48 md:w-72 md:h-72 object-contain mb-6"
                  src={theme === "light" ? "/logoblack.png" : "/logowhite.png"}
                />
              </div>
              <div className="flex-1 p-8 flex flex-col justify-center">
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-semibold text-start mb-8">
                    Welcome to <span className="font-light">AALAA designs</span>
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">
                    Sign in
                  </h3>
                  <form
                    className="space-y-6"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <Input
                      isRequired
                      id="email"
                      label="Enter your email address"
                      size="lg"
                      value={emailValue}
                      variant="flat"
                      onValueChange={setEmailValue}
                    />
                    <Input
                      isRequired
                      id="password"
                      label="Enter your Password"
                      size="lg"
                      type="password"
                      value={passwordValue}
                      variant="flat"
                      onValueChange={setPasswordValue}
                    />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm space-y-2 sm:space-y-0">
                      <Link href="/Auth/sign-up">
                        <span className="text-gray-600">No Account? </span>
                        <span className="text-blue-600">Sign up</span>
                      </Link>
                      <Link
                        className="text-blue-600"
                        href="auth/forgot-password"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <Button
                      disableRipple
                      {...(IsSigningin ? { isLoading: true } : {})}
                      className="w-full rounded"
                      size="lg"
                      onClick={handleSignIn}
                    >
                      Sign in
                    </Button>
                  </form>
                </div>
                <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                  &copy; 2024 AALAA designs. All rights reserved.
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      {(error || formError) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Alert className="max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg border-l-4 border-red-500 relative">
            <button
              aria-label="Close alert"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={closeAlert}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <XCircle className="h-6 w-6 text-red-500" />
              <div>
                <AlertTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Error
                </AlertTitle>
                <AlertDescription className="text-gray-700 dark:text-gray-300">
                  {formError ||
                    "Incorrect email or password. Please try again."}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>
      )}
    </div>
  );
}
