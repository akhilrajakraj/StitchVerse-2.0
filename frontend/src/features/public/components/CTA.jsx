import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section 
      className="relative py-24 bg-cover bg-center bg-fixed overflow-hidden"
      style={{
        backgroundImage: `url('https://readdy.ai/api/search-image?query=Luxurious%20fashion%20design%20studio%20with%20elegant%20custom%20dresses%20on%20mannequins%2C%20flowing%20silk%20fabrics%2C%20designer%20workspace%20with%20sketches%2C%20premium%20materials%2C%20and%20sophisticated%20lighting%20showcasing%20high-end%20couture%20creation%20and%20feminine%20fashion%20artistry&width=1920&height=800&seq=cta-customer1&orientation=landscape')`
      }}
    >
      {/* 1. Dynamic Overlay! Notice the dark:from-gray-900 classes! */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-600/80 to-purple-800/90 dark:from-gray-900/95 dark:via-purple-900/80 dark:to-gray-900/95 transition-colors duration-500" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          Your Perfect Dress is Waiting
        </h2>
        <p className="text-xl md:text-2xl text-pink-50 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Don't just dream about the perfect dress - create it. Whether it's your wedding day, 
          a special celebration, or just because you deserve something beautiful.
        </p>

        {/* 2. Glowing Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <Link 
            to="/custom-order"
            className="bg-white dark:bg-pink-500 text-pink-600 dark:text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 dark:hover:bg-pink-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] dark:hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] whitespace-nowrap cursor-pointer"
          >
            Design Your Dress
          </Link>
          <Link 
            to="/gallery"
            className="border-2 border-white/80 dark:border-white/50 text-white bg-white/5 dark:bg-black/10 backdrop-blur-sm px-10 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-pink-600 dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1 whitespace-nowrap cursor-pointer"
          >
            Get Inspired
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="text-center group cursor-pointer">
            <div className="w-20 h-20 flex items-center justify-center bg-white/10 dark:bg-black/20 backdrop-blur-md text-white rounded-full mx-auto mb-6 border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-lg">
              <i className="ri-heart-line text-3xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Wedding Dreams</h3>
            <p className="text-pink-100 dark:text-gray-300 mb-4 leading-relaxed">
              Create the wedding gown of your dreams with intricate details, perfect fit, 
              and memories that last a lifetime.
            </p>
            <Link 
              to="/wedding-dresses"
              className="inline-flex items-center text-white font-semibold hover:text-pink-200 dark:hover:text-pink-400 transition-colors cursor-pointer group-hover:underline"
            >
              Explore Wedding Gowns
              <i className="ri-arrow-right-line ml-2 transform group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="text-center group cursor-pointer">
            <div className="w-20 h-20 flex items-center justify-center bg-white/10 dark:bg-black/20 backdrop-blur-md text-white rounded-full mx-auto mb-6 border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-lg">
              <i className="ri-star-line text-3xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Special Occasions</h3>
            <p className="text-pink-100 dark:text-gray-300 mb-4 leading-relaxed">
              From galas to graduations, create show-stopping dresses that make every 
              moment unforgettable and uniquely yours.
            </p>
            <Link 
              to="/occasion-dresses"
              className="inline-flex items-center text-white font-semibold hover:text-pink-200 dark:hover:text-pink-400 transition-colors cursor-pointer group-hover:underline"
            >
              Browse Occasion Wear
              <i className="ri-arrow-right-line ml-2 transform group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="text-center group cursor-pointer">
            <div className="w-20 h-20 flex items-center justify-center bg-white/10 dark:bg-black/20 backdrop-blur-md text-white rounded-full mx-auto mb-6 border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-lg">
              <i className="ri-magic-line text-3xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Everyday Elegance</h3>
            <p className="text-pink-100 dark:text-gray-300 mb-4 leading-relaxed">
              Transform your daily wardrobe with custom pieces that reflect your style 
              and make you feel confident every day.
            </p>
            <Link 
              to="/everyday-dresses"
              className="inline-flex items-center text-white font-semibold hover:text-pink-200 dark:hover:text-pink-400 transition-colors cursor-pointer group-hover:underline"
            >
              Create Daily Elegance
              <i className="ri-arrow-right-line ml-2 transform group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        </div>

        {/* 3. Ultra Premium Glass Box CTA */}
        <div className="mt-20 p-10 bg-white/10 dark:bg-black/30 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 rounded-3xl max-w-3xl mx-auto shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
          <h4 className="text-3xl font-bold text-white mb-4">Ready to Begin?</h4>
          <p className="text-pink-100 dark:text-gray-300 mb-8 text-lg">
            Start with a simple consultation and let our experts guide you through 
            creating your perfect custom dress.
          </p>
          <Link 
            to="/consultation"
            className="inline-block bg-pink-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-pink-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(219,39,119,0.5)] cursor-pointer whitespace-nowrap"
          >
            Book Free Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}