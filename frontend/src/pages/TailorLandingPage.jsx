import TailorFeatures from '../components/TailorFeatures';
import TailorSuccess from '../components/TailorSuccess';
import TailorCTA from '../components/TailorCTA';

function TailorLandingPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* You can add a Tailor-specific Hero here later, 
                but for now, let's stack the tailor blocks! */}
            <TailorFeatures />
            <TailorSuccess />
            <TailorCTA />
        </div>
    );
}

export default TailorLandingPage;