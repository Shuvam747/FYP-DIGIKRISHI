"use client"
import React, { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'  // Adjust according to your toast hook location
import { useRouter } from 'next/navigation'
import ErrorToast from '@/components/ui/errorToast'

export default function Page() {
  const router = useRouter()

  const handleError = () => {
    setTimeout(() => {
      router.push('/dashboard')
    },1000) 
  }

  // Simulating an error scenario or you could trigger handleError based on your logic
  useEffect(() => {
    handleError()
  }, [])

  return (
    <div>
      <ErrorToast errors={[{message:"Order's payment unsucessfull"}]}/>
    </div>
  )
}
