import { Link } from 'react-router-dom';

export default function TailorCTA() {
  return (
    <section 
      className="py-20 bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.8), rgba(67, 56, 202, 0.8)), url('https://readdy.ai/api/search-image?query=Professional%20master%20tailor%20workshop%20with%20elegant%20custom%20clothing%20on%20mannequins%2C%20vintage%20sewing%20machines%2C%20fabric%20bolts%2C%20measuring%20tools%2C%20warm%20lighting%20showcasing%20traditional%20craftsmanship%20and%20professional%20tailoring%20business%20environment&width=1920&height=800&seq=tailor-cta1&orientation=landscape')`
      }}
    >
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Your Craft Deserves Recognition
        </h2>
        <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join the premier platform where master tailors showcase their skills, build their business, 
          and connect with clients who truly appreciate quality craftsmanship.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link 
            to="/tailor/register"
            className="bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer shadow-lg"
          >
            Start Your Journey
          </Link>
          <Link 
            to="/tailor/dashboard-demo"
            className="border-2 border-white text-white px-10 py-4 rounded-lg text-lg font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 whitespace-nowrap cursor-pointer"
          >
            View Dashboard Demo
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 flex items-center justify-center bg-white/20 text-white rounded-full mx-auto mb-4">
              <i className="ri-store-line text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Build Your Brand</h3>
            <p className="text-gray-100 mb-4">
              Create a professional portfolio that showcases your expertise and attracts 
              high-paying clients who value quality craftsmanship.
            </p>
            <Link 
              to="/tailor/portfolio-builder"
              className="inline-flex items-center text-white hover:text-gray-200 transition-colors cursor-pointer"
            >
              Create Portfolio
              <div className="w-4 h-4 flex items-center justify-center ml-2">
                <i className="ri-arrow-right-line"></i>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 flex items-center justify-center bg-white/20 text-white rounded-full mx-auto mb-4">
              <i className="ri-global-line text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Global Opportunities</h3>
            <p className="text-gray-100 mb-4">
              Access international markets and serve customers worldwide. Break geographical 
              barriers and grow your business beyond local limitations.
            </p>
            <Link 
              to="/tailor/global-market"
              className="inline-flex items-center text-white hover:text-gray-200 transition-colors cursor-pointer"
            >
              Explore Markets
              <div className="w-4 h-4 flex items-center justify-center ml-2">
                <i className="ri-arrow-right-line"></i>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 flex items-center justify-center bg-white/20 text-white rounded-full mx-auto mb-4">
              <i className="ri-award-line text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Master Recognition</h3>
            <p className="text-gray-100 mb-4">
              Earn recognition through our certification program, customer reviews, 
              and featured artist spotlights that highlight exceptional craftsmanship.
            </p>
            <Link 
              to="/tailor/certification"
              className="inline-flex items-center text-white hover:text-gray-200 transition-colors cursor-pointer"
            >
              Get Certified
              <div className="w-4 h-4 flex items-center justify-center ml-2">
                <i className="ri-arrow-right-line"></i>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-16 p-8 bg-white/10 backdrop-blur-sm rounded-2xl max-w-2xl mx-auto">
          <h4 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Business?</h4>
          <p className="text-gray-100 mb-6">
            Join StitchVerse today and discover how technology can amplify your traditional 
            craftsmanship while connecting you with clients who appreciate your artistry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/tailor/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              Join Free Today
            </Link>
            <Link 
              to="/tailor/consultation"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}