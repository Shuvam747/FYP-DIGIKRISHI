"use client"
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const ResourceNotFound = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Resource Not Found</h2>
        <p className="text-gray-600 mb-6">
          The resource you are looking for does not exist or has been removed.
        </p>

        <Button
          asChild
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Link href="/resource" className="inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ResourceNotFound;
