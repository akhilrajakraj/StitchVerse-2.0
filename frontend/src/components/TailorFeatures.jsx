import { Link } from 'react-router-dom';

export default function TailorFeatures() {
  const features = [
    {
      icon: 'ri-store-line',
      title: 'Digital Storefront',
      description: 'Create a professional online presence with portfolio galleries, pricing, and booking systems to attract premium customers.',
      image: 'https://readdy.ai/api/search-image?query=Modern%20laptop%20displaying%20professional%20tailor%20website%20portfolio%20with%20elegant%20clothing%20designs%2C%20online%20storefront%20interface%2C%20digital%20workspace%20with%20measuring%20tools%20and%20fabric%20samples%20showcasing%20e-commerce%20tailoring%20business&width=300&height=200&seq=storefront1&orientation=landscape'
    },
    {
      icon: 'ri-global-line',
      title: 'Global Customer Reach',
      description: 'Connect with clients worldwide through our platform. No geographic limitations - serve customers from anywhere, anytime.',
      image: 'https://readdy.ai/api/search-image?query=World%20map%20with%20connection%20lines%20showing%20global%20network%2C%20shipping%20packages%20with%20custom%20clothing%2C%20international%20customers%20icons%2C%20modern%20logistics%20showcasing%20worldwide%20tailoring%20business%20reach%20and%20global%20commerce&width=300&height=200&seq=global1&orientation=landscape'
    },
    {
      icon: 'ri-money-dollar-circle-line',
      title: 'Maximize Your Earnings',
      description: 'Set your own prices, receive secure payments, and keep more of what you earn with our competitive commission structure.',
      image: 'https://readdy.ai/api/search-image?query=Financial%20growth%20charts%20with%20tailoring%20business%20revenue%2C%20calculator%20with%20money%2C%20profit%20margins%2C%20payment%20processing%20icons%2C%20successful%20business%20metrics%20showcasing%20increased%20earnings%20for%20professional%20tailors&width=300&height=200&seq=earnings1&orientation=landscape'
    },
    {
      icon: 'ri-tools-line',
      title: 'Professional Management Tools',
      description: 'Streamline your workflow with order management, customer communication, and scheduling tools designed for busy tailors.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20tailor%20using%20tablet%20for%20order%20management%2C%20digital%20measuring%20tools%2C%20scheduling%20calendar%2C%20customer%20communication%20app%2C%20modern%20workflow%20organization%20showcasing%20efficient%20tailoring%20business%20management%20technology&width=300&height=200&seq=tools1&orientation=landscape'
    },
    {
      icon: 'ri-award-line',
      title: 'Build Your Reputation',
      description: 'Showcase your craftsmanship through verified reviews, featured work, and recognition badges to attract premium clients.',
      image: 'https://readdy.ai/api/search-image?query=Awards%20and%20certificates%20for%20master%20tailor%2C%20five-star%20customer%20reviews%2C%20recognition%20badges%2C%20quality%20craftsmanship%20showcase%2C%20reputation%20building%20elements%2C%20professional%20achievements%20in%20tailoring%20industry&width=300&height=200&seq=reputation1&orientation=landscape'
    },
    {
      icon: 'ri-graduation-cap-line',
      title: 'Continuous Learning Hub',
      description: 'Access exclusive workshops, technique videos, and connect with master tailors to continuously improve your skills.',
      image: 'https://readdy.ai/api/search-image?query=Online%20learning%20platform%20for%20tailors%2C%20video%20tutorials%2C%20master%20craftsman%20teaching%20advanced%20techniques%2C%20skill%20development%20workshops%2C%20professional%20education%20in%20fashion%20design%20and%20tailoring%20methods&width=300&height=200&seq=learning1&orientation=landscape'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Grow Your Tailoring Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful tailors who have transformed their craft into thriving businesses. 
            Our platform provides everything you need to scale, succeed, and showcase your expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
            >
              <div className="relative mb-6">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <div className="absolute -bottom-2 -right-2 w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full group-hover:bg-blue-700 transition-colors duration-300">
                  <i className={`${feature.icon} text-xl`}></i>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link 
            to="/tailor/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 whitespace-nowrap cursor-pointer"
          >
            Start Your Journey Today
          </Link>
        </div>
      </div>
    </section>
  );
}