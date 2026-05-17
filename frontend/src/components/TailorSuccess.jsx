import { useState, useEffect } from 'react';

// 1. We moved the stories OUTSIDE the component!
const successStories = [
  {
    id: 1,
    title: 'From Local Shop to Global Business',
    story: 'A master tailor expanded from a small neighborhood shop to serving international clients, increasing monthly revenue by 300% through the platform\'s global reach.',
    image: 'https://readdy.ai/api/search-image?query=Successful%20tailor%20workshop%20with%20international%20shipping%20boxes%2C%20world%20map%20showing%20global%20customers%2C%20revenue%20growth%20charts%2C%20modern%20sewing%20equipment%2C%20professional%20workspace%20showcasing%20business%20expansion%20and%20global%20success&width=600&height=400&seq=success1&orientation=landscape',
    category: 'Business Growth',
    achievement: '300% Revenue Increase'
  },
  {
    id: 2,
    title: 'Digital Transformation Success',
    story: 'Traditional craftsman embraced digital tools and online portfolio, attracting premium clients and establishing a waiting list of over 100 customers within six months.',
    image: 'https://readdy.ai/api/search-image?query=Modern%20tailor%20using%20laptop%20and%20digital%20tools%20in%20traditional%20workshop%2C%20online%20portfolio%20display%2C%20customer%20management%20system%2C%20blend%20of%20traditional%20craftsmanship%20with%20modern%20technology%20showcasing%20digital%20business%20transformation&width=600&height=400&seq=digital-success1&orientation=landscape',
    category: 'Digital Innovation',
    achievement: '100+ Client Waitlist'
  },
  {
    id: 3,
    title: 'Specialty Expertise Recognition',
    story: 'A wedding dress specialist gained recognition as a top-rated artisan, completing over 200 custom bridal gowns and earning master craftsman certification.',
    image: 'https://readdy.ai/api/search-image?query=Award-winning%20bridal%20workshop%20with%20beautiful%20wedding%20dresses%2C%20master%20craftsman%20certificates%2C%20five-star%20ratings%20display%2C%20luxury%20bridal%20fabrics%2C%20professional%20achievement%20showcase%20in%20specialized%20wedding%20tailoring&width=600&height=400&seq=bridal-success1&orientation=landscape',
    category: 'Specialization Mastery',
    achievement: 'Master Certification'
  },
  {
    id: 4,
    title: 'Apprenticeship to Entrepreneurship',
    story: 'Young tailor built a thriving business from apprentice level, now mentoring others and running a team of 5 craftsmen serving high-end clientele.',
    image: 'https://readdy.ai/api/search-image?query=Young%20successful%20tailor%20leading%20team%20workshop%2C%20mentoring%20apprentices%2C%20modern%20tailoring%20business%2C%20professional%20equipment%2C%20team%20collaboration%2C%20entrepreneurial%20success%20story%20in%20fashion%20craftsmanship%20industry&width=600&height=400&seq=entrepreneur-success1&orientation=landscape',
    category: 'Career Development',
    achievement: 'Team of 5 Craftsmen'
  }
];

export default function TailorSuccess() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // 2. No more warning! React knows 'successStories.length' is permanently 4.
      setCurrentSlide((prev) => (prev + 1) % successStories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []); // Keep this array empty!

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Success Stories from Fellow Tailors
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of tailors who have transformed their craft into thriving businesses. 
            See how platform tools and global reach have helped artisans achieve their goals.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2">
              <div className="relative h-96 md:h-auto">
                <img
                  src={successStories[currentSlide].image}
                  alt={successStories[currentSlide].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {successStories[currentSlide].category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-blue-200 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <i className="ri-double-quotes-l text-4xl"></i>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {successStories[currentSlide].title}
                </h3>

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {successStories[currentSlide].story}
                </p>

                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-3">
                    <i className="ri-trophy-fill"></i>
                  </div>
                  <span className="text-blue-600 font-semibold">
                    {successStories[currentSlide].achievement}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-3 mt-8">
            {successStories.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 cursor-pointer ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-gray-600">Active Tailors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$2.5M+</div>
              <div className="text-gray-600">Monthly Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}