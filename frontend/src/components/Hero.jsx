import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Explicitly import your local assets from the project folder
import bannerImg from '../assets/images/backgroundindex.jpg';
import maleImg from '../assets/images/customerhome.jpg.jpg';
import femaleImg from '../assets/images/tailorbghome.jpg';

const slides = [
  {
    title: "Your Dream Dress Awaits",
    subtitle: "From elegant wedding gowns to stunning evening wear - bring your vision to life with expert craftsmanship.",
    cta: "Design Your Dress",
    image: bannerImg
  },
  {
    title: "Couture Quality, Custom Made",
    subtitle: "Experience luxury tailoring with personalized designs created just for you by master artisans.",
    cta: "Explore Designs",
    image: maleImg
  },
  {
    title: "Perfect Fit, Every Time",
    subtitle: "Upload your inspiration, choose your style, and watch as skilled tailors create your perfect garment.",
    cta: "Start Creating",
    image: femaleImg
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 seconds transition window
    
    return () => clearInterval(timer);
  }, []); 

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      
      {/* 1. Hardware Accelerated High-Fidelity Image Engine */}
      {slides.map((slide, index) => (
        <img
          key={index}
          src={slide.image}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out select-none will-change-opacity ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } transition-transform duration-[6000ms]`}
        />
      ))}

      {/* Dark Mode Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 dark:from-black/80 dark:to-black/50 transition-colors duration-500" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="w-full max-w-4xl">
          
          {/* Glassmorphism Card */}
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl transition-all duration-500">
            
            <div className="overflow-hidden">
              <h1 
                className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg transition-all duration-700"
                key={currentSlide}
              >
                {slides[currentSlide].title}
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl mb-10 text-gray-100 dark:text-gray-200 leading-relaxed max-w-3xl drop-shadow-md">
              {slides[currentSlide].subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <Link 
                to="/custom-order" 
                className="bg-pink-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-pink-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(219,39,119,0.5)] text-center whitespace-nowrap cursor-pointer"
              >
                {slides[currentSlide].cta}
              </Link>
              <Link 
                to="/gallery" 
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl text-lg font-bold backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 text-center whitespace-nowrap cursor-pointer"
              >
                Browse Inspiration
              </Link>
            </div>

            {/* Slider Dots */}
            <div className="flex space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                    index === currentSlide ? 'w-10 bg-pink-500' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
            
          </div>
        </div>
      </div>

      {/* Bouncing Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white cursor-pointer border border-white/20 hover:bg-white/20 transition-colors">
          <i className="ri-arrow-down-line text-2xl"></i>
        </div>
      </div>
    </section>
  );
}
