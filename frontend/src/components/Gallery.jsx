import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Styles' },
    { id: 'wedding', name: 'Wedding Gowns' },
    { id: 'evening', name: 'Evening Wear' },
    { id: 'cocktail', name: 'Cocktail Dresses' },
    { id: 'casual', name: 'Casual Elegance' },
    { id: 'formal', name: 'Formal Attire' }
  ];

  const designs = [
    {
      id: 1,
      category: 'wedding',
      title: 'Romantic Lace Wedding Gown',
      description: 'Intricate lace detailing with flowing train',
      image: 'https://readdy.ai/api/search-image?query=Breathtaking%20white%20wedding%20dress%20with%20delicate%20French%20lace%2C%20cathedral%20train%2C%20off-shoulder%20sleeves%2C%20and%20pearl%20embellishments%20displayed%20in%20luxury%20bridal%20boutique%20with%20soft%20romantic%20lighting%20showcasing%20ethereal%20beauty%20and%20bridal%20elegance&width=400&height=500&seq=wedding-customer1&orientation=portrait',
      style: 'Romantic & Timeless'
    },
    {
      id: 2,
      category: 'evening',
      title: 'Glamorous Evening Gown',
      description: 'Sequined bodice with dramatic silhouette',
      image: 'https://readdy.ai/api/search-image?query=Stunning%20black%20evening%20gown%20with%20sparkling%20sequins%2C%20dramatic%20floor-length%20silhouette%2C%20elegant%20neckline%2C%20and%20sophisticated%20draping%20displayed%20in%20upscale%20fashion%20showroom%20with%20dramatic%20lighting%20showcasing%20luxury%20and%20glamour&width=400&height=500&seq=evening1&orientation=portrait',
      style: 'Glamorous & Bold'
    },
    {
      id: 3,
      category: 'cocktail',
      title: 'Chic Midi Cocktail Dress',
      description: 'Perfect balance of elegance and playfulness',
      image: 'https://readdy.ai/api/search-image?query=Elegant%20midi%20cocktail%20dress%20in%20deep%20burgundy%20with%20sophisticated%20cut%2C%20three-quarter%20sleeves%2C%20and%20refined%20silhouette%20displayed%20in%20modern%20boutique%20with%20clean%20lighting%20showcasing%20contemporary%20feminine%20style%20and%20versatility&width=400&height=500&seq=cocktail-customer1&orientation=portrait',
      style: 'Modern & Chic'
    },
    {
      id: 4,
      category: 'casual',
      title: 'Flowing Summer Maxi',
      description: 'Effortless style for everyday elegance',
      image: 'https://readdy.ai/api/search-image?query=Beautiful%20flowing%20maxi%20dress%20in%20soft%20floral%20print%20with%20feminine%20silhouette%2C%20flutter%20sleeves%2C%20and%20lightweight%20fabric%20displayed%20in%20bright%20airy%20boutique%20with%20natural%20lighting%20showcasing%20casual%20elegance%20and%20summer%20style&width=400&height=500&seq=casual-customer1&orientation=portrait',
      style: 'Effortless & Feminine'
    },
    {
      id: 5,
      category: 'formal',
      title: 'Executive Power Dress',
      description: 'Sophisticated tailoring for professional settings',
      image: 'https://readdy.ai/api/search-image?query=Professional%20navy%20blue%20business%20dress%20with%20impeccable%20tailoring%2C%20clean%20lines%2C%20sophisticated%20silhouette%2C%20and%20quality%20fabric%20displayed%20in%20upscale%20fashion%20boutique%20showcasing%20executive%20style%20and%20professional%20elegance&width=400&height=500&seq=formal-customer1&orientation=portrait',
      style: 'Professional & Polished'
    },
    {
      id: 6,
      category: 'evening',
      title: 'Red Carpet Statement Gown',
      description: 'Show-stopping design for special occasions',
      image: 'https://readdy.ai/api/search-image?query=Magnificent%20red%20evening%20gown%20with%20dramatic%20train%2C%20elegant%20beading%2C%20strapless%20design%2C%20and%20luxurious%20fabric%20displayed%20in%20high-end%20fashion%20showroom%20with%20glamorous%20lighting%20showcasing%20red%20carpet%20elegance%20and%20star%20quality&width=400&height=500&seq=redcarpet1&orientation=portrait',
      style: 'Statement & Luxurious'
    },
    {
      id: 7,
      category: 'wedding',
      title: 'Bohemian Wedding Dress',
      description: 'Free-spirited design with vintage touches',
      image: 'https://readdy.ai/api/search-image?query=Bohemian%20wedding%20dress%20with%20flowing%20fabric%2C%20intricate%20embroidery%2C%20long%20sleeves%2C%20and%20vintage-inspired%20details%20displayed%20in%20rustic%20boutique%20setting%20with%20soft%20natural%20lighting%20showcasing%20boho%20chic%20bridal%20style%20and%20romantic%20femininity&width=400&height=500&seq=boho-wedding1&orientation=portrait',
      style: 'Boho & Romantic'
    },
    {
      id: 8,
      category: 'cocktail',
      title: 'Little Black Dress Reimagined',
      description: 'Classic silhouette with contemporary twist',
      image: 'https://readdy.ai/api/search-image?query=Sophisticated%20little%20black%20dress%20with%20contemporary%20asymmetric%20neckline%2C%20perfect%20fit%2C%20and%20modern%20details%20displayed%20in%20minimalist%20boutique%20with%20elegant%20lighting%20showcasing%20timeless%20style%20with%20modern%20sophistication&width=400&height=500&seq=lbd1&orientation=portrait',
      style: 'Timeless & Contemporary'
    }
  ];

  const filteredDesigns = selectedCategory === 'all' 
    ? designs 
    : designs.filter(design => design.category === selectedCategory);

  return (
    // 1. Smooth gradient transition for dark mode background
    <section className="py-24 bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
            Design Inspiration Gallery
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 transition-colors">
            Discover the endless possibilities for your custom dress. From romantic wedding gowns to 
            powerful evening wear, see what dreams can become reality through expert craftsmanship.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                // 2. Active buttons glow pink, inactive buttons fade to dark gray panels
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  selectedCategory === category.id
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30 dark:shadow-pink-500/20 transform scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {filteredDesigns.map((design) => (
            <div 
              key={design.id}
              className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-500"
            >
              {/* 3. Deepened the card borders and removed white background popping in dark mode */}
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 border border-transparent dark:border-gray-700 shadow-sm dark:shadow-none aspect-[4/5] mb-5">
                <img
                  src={design.image}
                  alt={design.title}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Darker overlay on hover for better text readability */}
                <div className="absolute inset-0 bg-black/10 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* 4. Adaptive Glassmorphism tags! */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-pink-600 dark:text-pink-400 border border-white/20 dark:border-gray-700/50 shadow-sm">
                  {design.style}
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 border border-white/20 dark:border-gray-700/50 shadow-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                    {design.description}
                  </p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200">
                {design.title}
              </h3>
              
              <div className="flex items-center text-pink-600 dark:text-pink-500 font-semibold text-sm">
                Get This Style
                <div className="w-5 h-5 flex items-center justify-center ml-2 group-hover:translate-x-2 transition-transform duration-300">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/gallery"
            className="inline-block bg-pink-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-pink-700 dark:hover:bg-pink-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-pink-500/30 dark:hover:shadow-pink-500/20 whitespace-nowrap cursor-pointer"
          >
            Explore Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
}