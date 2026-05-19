import Hero from '../components/Hero';
import Features from '../components/Features';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* The pt-20 or margin-top is usually handled by your layout, 
                but we wrap everything here so it flows perfectly */}
            <Hero />
            <Features />
            <Gallery />
            <Testimonials />
            <CTA />
        </div>
    );
}

export default HomePage;