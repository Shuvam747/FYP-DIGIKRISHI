"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import axios from "axios"
import ErrorToast from "@/components/ui/errorToast"

interface FormState {
  username: string
  email: string
  password: string
  confirmPassword: string
}

interface ErrorState {
  message: string
  field?: string
}
export default function SignupPage() {
  const [formData, setFormData] = useState<FormState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<ErrorState[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSignupSuccess, setIsSignupSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors([])

    const validationErrors: ErrorState[] = []

    if (formData.password !== formData.confirmPassword) {
      validationErrors.push({
        message: "Passwords do not match",
        field: "confirmPassword",
      })
    }

    if (!formData.email.includes("@")) {
      validationErrors.push({
        message: "Please enter a valid email address",
        field: "email",
      })
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post("http://localhost:4000/api/v1/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
      console.log(response.data)

      setIsSignupSuccess(true)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message)
        setErrors([{ message: error.message }])
      } else {
        console.log(error)
        setErrors([{ message: "An unexpected error occurred." }])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-7xl w-full flex bg-white rounded-lg shadow-lg overflow-hidden">
        <Card className="w-full md:w-1/2 p-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-green-700">Create your account</CardTitle>
            <CardDescription>Join our community and start your journey</CardDescription>
          </CardHeader>
          <CardContent>
            {isSignupSuccess ? (
              <div className="text-center space-y-4">
                <Icons.check className="w-12 h-12 text-green-500 mx-auto" />
                <h3 className="text-2xl font-medium text-gray-900">Welcome aboard!</h3>
                <p className="text-gray-600">Your account has been created successfully.</p>
                <Button asChild className="mt-4">
                  <Link href="/login">Go to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                {errors.length > 0 && (
                    <ErrorToast errors={errors} />
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Sign up
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="md:block w-1/2 bg-gradient-to-br from-green-600 to-green-700 text-white p-12 flex flex-col justify-center rounded-r-lg">
          <h3 className="text-4xl font-bold mb-8 text-center text-green-100">Welcome to Our Community!</h3>
          <p className="text-center text-xl mb-12 text-green-50">
            Join an amazing network of users committed to making great things happen!
          </p>

          <div className="grid grid-cols-3 gap-8 mb-12">
            {[
              { src: "/images/connect.png", alt: "Connect", title: "Connect" },
              { src: "/images/grow.png", alt: "Grow", title: "Grow" },
              { src: "/images/resource.png", alt: "Resources", title: "Resources" },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-full p-6 mb-4 mx-auto w-24 h-24 flex items-center justify-center shadow-lg transform transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-2xl">
                  <div className="relative w-16 h-16">
                    <Image
                      src={item.src || "/placeholder.svg"}
                      alt={item.alt}
                      layout="fill"
                      objectFit="contain"
                      className="transition-all duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>
                </div>
                <p className="font-bold text-lg text-green-100 group-hover:text-white transition-colors duration-300">
                  {item.title}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-lg mb-8 text-green-100">Ready to make a difference? Join us today!</p>

          <div className="text-center">
            <Link
              href="/"
              className="inline-block bg-white text-green-700 font-semibold py-2 px-6 rounded-full hover:bg-green-100 transition-colors duration-300 transform hover:scale-105"
            >
              Learn more about us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

