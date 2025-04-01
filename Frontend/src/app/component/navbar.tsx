import Link from "next/link";

export function Navbar() {
    return (
      <nav className="bg-green-600">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-white font-bold text-xl"> <Link href="/">Digi Krishi</Link></div>
          <div className="space-x-6">
          <Link href="/#features" className="text-white hover:text-gray-200">Features</Link>
            <a href="/resource" className="text-white hover:text-gray-200">Resources</a>
            <a href="/signup" className="ml-6 px-5 py-2 bg-white text-green-600 font-semibold rounded-lg shadow-md hover:bg-green-700 hover:text-white transition duration-300">Get Started</a>
          </div>
        </div>
      </nav>
    );
  }
  