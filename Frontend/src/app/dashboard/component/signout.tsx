import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui or similar UI library
import ErrorToast from "@/components/ui/errorToast";

export default function SignOut() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:4000/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      setErrorMessage("An error occurred while signing out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Sign Out</h1>
      
      {errorMessage && (
       <ErrorToast errors={[{ message: errorMessage }]} />
      )}

      <Button
        onClick={handleSignOut}
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-lg transition duration-300 ease-in-out"
      >
        {loading ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  );
}

