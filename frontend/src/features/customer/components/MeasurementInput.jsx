// 🌟 Reusable element containing your classy, premium custom Tailwind styling!
export default function MeasurementInput({ id, label, value, onChange, placeholder }) {
    return (
        <div className="flex flex-col">
            {/* Classy small labels */}
            <label htmlFor={id} className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">
                {label}
            </label>
            
            {/* High-fidelity, smooth border input element with responsive tracking */}
            <input 
                type="number" 
                step="0.01" 
                min="0"
                id={id} 
                name={id} 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder}
                autoComplete="off"
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 text-sm outline-none transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-900/50"
            />
        </div>
    );
}