
export function HeroSection() {
    return (
      <section
        className="flex-grow bg-gray-100 flex items-center bg-cover bg-center h-3/4"
        style={{ backgroundImage: "url(images/herosection.jpg)" }}
      >
        <div className="container mx-auto px-4 py-32 text-center bg-black bg-opacity-50">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to Digi Krishi
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Your trusted companion in the digital age of farming.
          </p>

          <a
            href="/signup"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg"
          >
            Get Started
          </a>
        </div>
      </section>
    );
  }
  