import Image from 'next/image';

const cardData = [
  {
    src: '/images/farm1.jpg',
    alt: 'Advanced Irrigation Systems',
    description: 'Advanced irrigation systems for optimal water usage.',
  },
  {
    src: '/images/farm2.jpg',
    alt: 'Smart Crop Management',
    description: 'Smart crop management to boost yields.',
  },
  {
    src: '/images/farm3.jpg',
    alt: 'Innovative Farming Techniques',
    description: 'Innovative techniques for sustainable agriculture.',
  },
  {
    src: '/images/farm4.jpg',
    alt: 'Precision Agriculture',
    description: 'Precision agriculture for maximum efficiency and productivity.',
  },
  {
    src: '/images/farm5.jpg',
    alt: 'Automated Farming',
    description: 'Automated farming systems to reduce labor and improve yield.',
  },
  {
    src: '/images/farm6.jpg',
    alt: 'Soil Health Monitoring',
    description: 'Soil health monitoring to optimize fertilization and irrigation.',
  },
];

export function ContentSection() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
          Our Innovative Solutions
        </h2>

        {/* Dynamic Image Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <Image
                src={card.src}
                alt={card.alt}
                width={400}
                height={250}  // Limiting image height to 250px
                className="object-cover mb-4 rounded-lg shadow-lg transition-all duration-300"
              />
              <p className="text-lg text-gray-600 text-center">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
