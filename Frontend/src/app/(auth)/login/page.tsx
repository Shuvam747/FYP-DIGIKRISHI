"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import ErrorToast from "@/components/ui/errorToast"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"

interface FormState {
  email: string
  password: string
}

interface ErrorState {
  message: string
  field?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<ErrorState[]>([])
  const [isLoginSuccess, setIsLoginSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors: ErrorState[] = []

    if (!formData.email.includes("@")) {
      validationErrors.push({ message: "Valid email required", field: "email" })
    }

    if (formData.password.length < 6) {
      validationErrors.push({ message: "6+ characters required", field: "password" })
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    try {
      const response = await axios.post("http://localhost:4000/api/v1/auth/login", {
        email: formData.email,
        password: formData.password,
      },{
        withCredentials: true
      })
      if (response.status === 200) 
        router.push("/dashboard ")
      setIsLoginSuccess(true)
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.error(error.message)
        setErrors([{ message: error.message }])
      } else {
        console.log(error)
        setErrors([{ message: "An unexpected error occurred." }])
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Login Section */}
      <div className="w-full md:w-1/2 p-8 md:p-12 bg-white flex items-center justify-center relative overflow-hidden">
        {/* Shiny elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Don not have an account?{" "}
              <Link href="/signup" className="text-green-600 hover:text-green-800">
                Sign up
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoginSuccess ? (
              // Redirect to dashboard
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-medium text-gray-900">Welcome back</h3>
                <p className="text-gray-600">Redirecting to your dashboard...</p>
                <Link href="/dashboard" className="text-green-600 hover:text-green-800 transition-colors">
                  Click here if not redirected
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.length > 0 && (
                    <ErrorToast errors={errors} />
                )}
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            )}
               <button>
          <Link
  href="/admin/login"
  className="inline-block px-6 py-2"
>
  Login as admin
</Link>
          </button>
          </CardContent>
         
          

        </Card>
      </div>

      {/* Welcome Section with Image */}
      <div className="w-full md:w-1/2 bg-green-700 p-8 md:p-12 flex items-center justify-center relative">
        <Image
          src="/images/green.jpg"
          alt="Nature background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          width={800}
          height={1200}
        />
        <div className="max-w-md w-full space-y-6 text-white relative z-10">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold">Welcome to our community</h3>
            <p className="text-lg opacity-90">
              Join thousands of members sharing knowledge and growing together. Start your journey with us today.
            </p>
          </div>

          <div className="flex gap-4 opacity-90">
            <div className="flex-1 border-l-2 border-white/20 pl-4">
              <p className="font-medium text-xl">Connect</p>
              <p className="mt-1">Network with professionals</p>
            </div>
            <div className="flex-1 border-l-2 border-white/20 pl-4">
              <p className="font-medium text-xl">Learn</p>
              <p className="mt-1">Access valuable resources</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}