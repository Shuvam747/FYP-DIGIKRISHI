export function Footer() {
    return (
      <footer className="bg-gray-800">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-white">
            &copy; {new Date().getFullYear()} Digi Krishi. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }