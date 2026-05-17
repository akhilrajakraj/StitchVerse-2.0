import { Link } from 'react-router-dom';

export default function Features() {
  const features = [
    {
      icon: 'ri-magic-line',
      title: 'Custom Design Process',
      description: 'Share your inspiration, measurements, and preferences. Our tailors transform your vision into reality with expert craftsmanship.',
      image: 'https://readdy.ai/api/search-image?query=Fashion%20design%20sketch%20process%20with%20elegant%20dress%20drawings%2C%20fabric%20swatches%2C%20measuring%20tools%2C%20and%20design%20consultation%20materials%20arranged%20on%20stylish%20workspace%20showcasing%20custom%20clothing%20creation%20and%20personalized%20fashion%20design%20services&width=400&height=300&seq=process1&orientation=landscape'
    },
    {
      icon: 'ri-palette-line',
      title: 'Unlimited Style Options',
      description: 'From classic silhouettes to avant-garde designs, choose any style, color, or fabric combination to match your unique taste.',
      image: 'https://readdy.ai/api/search-image?query=Colorful%20fabric%20selection%20display%20with%20luxury%20textiles%2C%20silk%20swatches%2C%20lace%20samples%2C%20and%20design%20options%20arranged%20beautifully%20in%20fashion%20atelier%20showcasing%20endless%20possibilities%20for%20custom%20dress%20creation%20and%20material%20choices&width=400&height=300&seq=fabrics1&orientation=landscape'
    },
    {
      icon: 'ri-user-heart-line',
      title: 'Perfect Fit Guarantee',
      description: 'Using precise measurements and multiple fittings, we ensure your dress fits like it was made just for you - because it was.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20dress%20fitting%20session%20with%20elegant%20woman%20being%20measured%20for%20custom%20gown%20by%20skilled%20tailor%20in%20sophisticated%20fashion%20studio%20with%20measuring%20tape%20and%20pins%20showcasing%20personalized%20tailoring%20service%20and%20perfect%20fit%20process&width=400&height=300&seq=fitting1&orientation=landscape'
    },
    {
      icon: 'ri-time-line',
      title: 'Crafted with Time & Care',
      description: 'Each dress is meticulously handcrafted by skilled artisans who pour their expertise and attention into every detail.',
      image: 'https://readdy.ai/api/search-image?query=Master%20tailor%20hands%20working%20on%20intricate%20dress%20details%20with%20fine%20needlework%2C%20delicate%20embroidery%2C%20and%20precision%20sewing%20in%20traditional%20fashion%20workshop%20showcasing%20artisan%20craftsmanship%20and%20dedication%20to%20quality%20clothing%20construction&width=400&height=300&seq=crafting1&orientation=landscape'
    },
    {
      icon: 'ri-gift-line',
      title: 'Special Occasion Ready',
      description: 'Whether it\'s your wedding day, a gala, or career milestone, create the perfect dress for your most important moments.',
      image: 'https://readdy.ai/api/search-image?query=Elegant%20special%20occasion%20dresses%20displayed%20for%20various%20events%20including%20wedding%20gown%2C%20evening%20wear%2C%20and%20formal%20attire%20in%20luxury%20boutique%20setting%20with%20sophisticated%20lighting%20showcasing%20celebration%20and%20milestone%20fashion&width=400&height=300&seq=occasions1&orientation=landscape'
    },
    {
      icon: 'ri-star-line',
      title: 'Heirloom Quality',
      description: 'Using premium materials and traditional techniques, your dress becomes a treasured piece you\'ll cherish for years to come.',
      image: 'https://readdy.ai/api/search-image?query=Luxury%20vintage%20dress%20storage%20with%20beautiful%20gowns%20carefully%20preserved%20in%20elegant%20wardobe%2C%20showcasing%20heirloom%20quality%20garments%2C%20fine%20fabrics%2C%20and%20timeless%20fashion%20pieces%20representing%20lasting%20craftsmanship%20and%20family%20treasures&width=400&height=300&seq=heirloom1&orientation=landscape'
    }
  ];

  return (
    <section className="relative py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
      
      {/* Decorative Ambient Background Blobs (Visible mainly in Dark Mode) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-6 transition-colors">
            Your Dream Dress Journey
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
            Experience the magic of custom fashion design. From initial concept to final creation, 
            every step is crafted to bring your unique vision to life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 rounded-3xl p-6 md:p-8 hover:shadow-2xl hover:shadow-pink-500/5 dark:hover:shadow-pink-500/10 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
            >
              {/* Image Container with hidden overflow for the zoom effect */}
              <div className="relative mb-8 rounded-2xl overflow-hidden h-48 md:h-56">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 dark:bg-black/30 transition-opacity duration-300 group-hover:opacity-0" />
                
                {/* Floating Icon Badge */}
                <div className="absolute -bottom-5 right-6 w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300 border-4 border-white dark:border-gray-800">
                  <i className={`${feature.icon} text-2xl`}></i>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 pr-12 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link 
            to="/custom-order"
            className="inline-flex items-center justify-center bg-pink-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-pink-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(219,39,119,0.4)] whitespace-nowrap cursor-pointer"
          >
            Start Your Custom Design
            <i className="ri-arrow-right-line ml-2 text-xl"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}