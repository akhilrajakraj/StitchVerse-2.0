import { useState, useEffect } from 'react';

// 1. Array stays safely outside the component!
const inspirationStories = [
  {
    id: 1,
    title: 'The Perfect Wedding Day',
    story: 'A bride\'s dream came true with a custom gown featuring hand-sewn pearls and vintage lace, creating an unforgettable moment as she walked down the aisle.',
    image: 'https://readdy.ai/api/search-image?query=Stunning%20bride%20in%20custom%20wedding%20gown%20with%20intricate%20lace%20details%20and%20pearl%20embellishments%2C%20radiant%20smile%2C%20elegant%20veil%2C%20walking%20in%20beautiful%20church%20ceremony%20with%20soft%20romantic%20lighting%20showcasing%20the%20perfect%20wedding%20moment%20and%20bridal%20beauty&width=800&height=600&seq=bride-story1&orientation=landscape',
    category: 'Wedding Dreams',
    emotion: 'Pure Joy'
  },
  {
    id: 2,
    title: 'Red Carpet Confidence',
    story: 'An elegant evening gown with dramatic silhouette and sparkling embellishments transformed an important gala night into a confidence-boosting, show-stopping experience.',
    image: 'https://readdy.ai/api/search-image?query=Elegant%20woman%20in%20stunning%20custom%20evening%20gown%20with%20sparkly%20details%20at%20glamorous%20gala%20event%2C%20confident%20pose%2C%20dramatic%20lighting%2C%20luxury%20venue%20background%20showcasing%20sophisticated%20fashion%20and%20red%20carpet%20elegance&width=800&height=600&seq=gala-story1&orientation=landscape',
    category: 'Evening Elegance',
    emotion: 'Confidence'
  },
  {
    id: 3,
    title: 'Career Milestone Moment',
    story: 'A perfectly tailored power dress in sophisticated navy helped mark a major career achievement, combining professional elegance with personal style.',
    image: 'https://readdy.ai/api/search-image?query=Professional%20woman%20in%20custom-tailored%20navy%20business%20dress%20at%20corporate%20event%2C%20confident%20stance%2C%20modern%20office%20setting%2C%20celebrating%20career%20achievement%20with%20elegant%20sophisticated%20styling%20and%20empowered%20presence&width=800&height=600&seq=career-story1&orientation=landscape',
    category: 'Professional Power',
    emotion: 'Empowerment'
  },
  {
    id: 4,
    title: 'Mother of the Bride Magic',
    story: 'A custom designed dress in soft rose gold brought tears of joy to a mother watching her daughter\'s wedding, feeling elegant and special on this precious day.',
    image: 'https://readdy.ai/api/search-image?query=Elegant%20mature%20woman%20in%20beautiful%20rose%20gold%20custom%20dress%20at%20wedding%20ceremony%2C%20emotional%20happy%20tears%2C%20soft%20lighting%2C%20wedding%20venue%20background%20showcasing%20maternal%20love%20and%20special%20occasion%20fashion%20elegance&width=800&height=600&seq=mother-story1&orientation=landscape',
    category: 'Family Moments',
    emotion: 'Maternal Love'
  }
];

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % inspirationStories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    // 1. Dark Mode background gradient added
    <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
            Dreams Made Reality
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto transition-colors">
            Every dress tells a story. See how our custom creations have become part of life's 
            most precious moments and celebrations.
          </p>
        </div>

        {/* The Main Slider Card */}
        <div className="max-w-6xl mx-auto">
          {/* 2. Added dark mode background, removed harsh white, added subtle dark border */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl dark:shadow-pink-500/5 border border-transparent dark:border-gray-700 transition-all duration-500">
            <div className="grid md:grid-cols-2">
              
              {/* Image Side */}
              <div className="relative h-[400px] md:h-auto overflow-hidden">
                <img
                  key={currentSlide} // Adding a key forces React to animate the swap!
                  src={inspirationStories[currentSlide].image}
                  alt={inspirationStories[currentSlide].title}
                  className="w-full h-full object-cover transition-opacity duration-1000 animate-pulse"
                  style={{ animation: 'none' }} // Prevents default pulse, relies on our transition
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent dark:from-black/60 transition-colors duration-300" />
                <div className="absolute top-6 left-6">
                  {/* Frosted Glass Tag */}
                  <span className="inline-block bg-white/90 dark:bg-gray-900/80 backdrop-blur-md text-pink-600 dark:text-pink-400 px-5 py-2 rounded-full text-sm font-bold border border-white/20 dark:border-gray-700">
                    {inspirationStories[currentSlide].category}
                  </span>
                </div>
              </div>
              
              {/* Text Side */}
              <div className="p-8 md:p-14 flex flex-col justify-center relative">
                
                {/* 3. Giant Quote Icon Background */}
                <div className="absolute top-8 right-8 text-pink-100 dark:text-gray-700/30 transition-colors duration-500">
                  <i className="ri-double-quotes-r text-8xl"></i>
                </div>

                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
                    {inspirationStories[currentSlide].title}
                  </h3>

                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed italic">
                    "{inspirationStories[currentSlide].story}"
                  </p>

                  <div className="flex items-center">
                    <div className="w-10 h-10 flex items-center justify-center bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full mr-4 transition-colors">
                      <i className="ri-heart-fill text-xl"></i>
                    </div>
                    <span className="text-pink-600 dark:text-pink-400 font-bold text-lg tracking-wide uppercase transition-colors">
                      {inspirationStories[currentSlide].emotion}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Dots */}
          <div className="flex justify-center space-x-3 mt-10">
            {inspirationStories.map((_, index) => (
              <button
                key={index}
                className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                  index === currentSlide 
                    ? 'w-10 bg-pink-600 dark:bg-pink-500' 
                    : 'w-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-pink-300 dark:hover:bg-gray-500'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* 4. The Statistics Banner */}
        <div className="text-center mt-24">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-extrabold text-pink-600 dark:text-pink-400 mb-3 drop-shadow-sm">25,000+</div>
              <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">Dreams Realized</div>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-extrabold text-pink-600 dark:text-pink-400 mb-3 drop-shadow-sm">500+</div>
              <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">Master Craftsmen</div>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-extrabold text-pink-600 dark:text-pink-400 mb-3 drop-shadow-sm">98%</div>
              <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">Perfect Fit Rate</div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}