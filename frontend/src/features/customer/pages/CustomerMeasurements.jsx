import { useCustomerMeasurements } from '../hooks/useCustomerMeasurements';
import MeasurementInput from '../components/MeasurementInput'; // 🌟 Import our reusable form input component

export default function CustomerMeasurements() {
    // 🧠 Unbox our state and data controller directly from our custom hook kitchen!
    const { formData, isLoading, isSaving, modal, setModal, handleChange, saveMeasurements } = useCustomerMeasurements();

    if (isLoading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div></div>;

    // 🗺️ Config mapping array schema to build the form layout grid dynamically
    const measurementFields = [
        { id: 'height_cm', label: 'Total Height (cm)', placeholder: '175.0' },
        { id: 'weight_kg', label: 'Body Weight (kg)', placeholder: '70.0' },
        { id: 'neck_cm', label: 'Neck Circumference (cm)', placeholder: '38.5' },
        { id: 'shoulder_cm', label: 'Shoulder Width (cm)', placeholder: '45.0' },
        { id: 'chest_cm', label: 'Chest Profile (cm)', placeholder: '100.0' },
        { id: 'bust_cm', label: 'Bust Line (cm)', placeholder: '98.0' },
        { id: 'waist_cm', label: 'Waist Metric (cm)', placeholder: '84.0' },
        { id: 'hip_cm', label: 'Hip Boundary (cm)', placeholder: '102.0' },
        { id: 'arm_length_cm', label: 'Full Arm Length (cm)', placeholder: '62.0' },
        { id: 'sleeve_length_cm', label: 'Target Sleeve (cm)', placeholder: '60.5' },
        { id: 'bicep_cm', label: 'Bicep Width (cm)', placeholder: '34.0' },
        { id: 'wrist_cm', label: 'Wrist Circumference (cm)', placeholder: '18.0' },
        { id: 'thigh_cm', label: 'Thigh Width (cm)', placeholder: '56.0' },
        { id: 'knee_cm', label: 'Knee Clearance (cm)', placeholder: '40.0' },
        { id: 'calf_cm', label: 'Calf Muscle (cm)', placeholder: '38.0' },
        { id: 'inseam_cm', label: 'Inseam Track (cm)', placeholder: '78.0' },
        { id: 'outseam_cm', label: 'Outseam Length (cm)', placeholder: '102.0' },
        { id: 'ankle_cm', label: 'Ankle Profile (cm)', placeholder: '24.0' },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl font-sans">
            {/* Modal Pop-up System Alert */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-gray-100 dark:border-gray-700">
                        <i className={`ri-${modal.type === 'success' ? 'checkbox-circle' : 'error-warning'}-fill text-5xl mb-2 block ${modal.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}></i>
                        <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{modal.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{modal.message}</p>
                        <button type="button" onClick={() => setModal({ ...modal, isOpen: false })} className="w-full bg-purple-600 text-white py-2.5 rounded-xl font-bold hover:bg-purple-700 transition-colors">Confirm</button>
                    </div>
                </div>
            )}

            {/* Main Header Presentation */}
            <div className="mb-6">
                <span className="text-xs text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10 font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                    Precision Sizing Vault
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-3">My Fit Parameters Blueprint</h1>
                <p className="text-gray-500 text-sm mt-1">Configure your personal multi-point body metrics layout array to ensure flawless custom stitching requests.</p>
            </div>

            {/* 🌟 The Main Styling Form Wrapper Panel Component Canvas */}
            <form onSubmit={saveMeasurements} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
                
                {/* Profile Title input text field */}
                <div className="w-full">
                    <label htmlFor="label" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Measurement Profile Title Card</label>
                    <input type="text" id="label" name="label" required value={formData.label} onChange={handleChange} autoComplete="off" className="w-full max-w-md p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. My Wedding Suit Profile" />
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                    <h3 className="text-md font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <i className="ri-ruler-2-line text-purple-500"></i> Multi-Point Anatomical Metrics Matrix (CM / KG)
                    </h3>
                    
                    {/* 🎨 Beautiful, scalable structural Tailwind grid container mapping! */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {measurementFields.map(field => (
                            <MeasurementInput 
                                key={field.id}
                                id={field.id}
                                label={field.label}
                                value={formData[field.id]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                            />
                        ))}
                    </div>
                </div>

                {/* Additional Crafting Notes textarea field */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                    <label htmlFor="notes" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Special Sizing Notes or Physical Exceptions</label>
                    <textarea id="notes" name="notes" rows="3" value={formData.notes} onChange={handleChange} placeholder="Specify alignment notes (e.g. sloping shoulders, loose cuffs)..." autoComplete="off" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 text-sm outline-none resize-none"></textarea>
                </div>

                {/* Submit Action Button trigger */}
                <button type="submit" disabled={isSaving} className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-md hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 flex justify-center items-center cursor-pointer disabled:bg-purple-400">
                    {isSaving ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 'Vault Fit Blueprints Data'}
                </button>
            </form>
        </div>
    );
}