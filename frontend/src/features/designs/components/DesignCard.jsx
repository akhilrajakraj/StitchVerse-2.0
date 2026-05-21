export default function DesignCard({ design, onEdit, onDelete, onView }) {
    // Safely extract the first image from the Django relation, or use a placeholder
    const coverImage = design.images && design.images.length > 0 
        ? design.images[0].image 
        : 'https://via.placeholder.com/300x300?text=No+Image';

    // Safely extract category name
    const categoryName = design.category ? design.category.name : 'Uncategorized';

    return (
        <div className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img 
                    src={coverImage} 
                    alt={design.name}
                    className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-3 right-3">
                    <button className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm cursor-pointer">
                        <i className="ri-more-2-line text-gray-600 dark:text-gray-300"></i>
                    </button>
                </div>
            </div>
            
            <div className="p-4 md:p-5">
                <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base line-clamp-1" title={design.name}>
                        {design.name}
                    </h3>
                    <span className="text-blue-600 dark:text-blue-400 font-black text-sm whitespace-nowrap">
                        ₹{parseFloat(design.price).toLocaleString('en-IN')}
                    </span>
                </div>
                
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    {categoryName}
                </p>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 h-10">
                    {design.description}
                </p>
                
                {/* Action Buttons Toolbar */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700/60">
                    <button 
                        onClick={() => onEdit(design)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-bold cursor-pointer transition-colors flex items-center gap-1"
                    >
                        <i className="ri-pencil-line"></i> Edit
                    </button>
                    
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => onView(design)}
                            title="Preview Details"
                            className="w-8 h-8 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                        >
                            <i className="ri-eye-line text-gray-600 dark:text-gray-300 text-sm"></i>
                        </button>
                        <button 
                            onClick={() => onDelete(design.id)}
                            title="Delete Design"
                            className="w-8 h-8 bg-red-50 dark:bg-red-500/10 rounded-lg flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
                        >
                            <i className="ri-delete-bin-line text-red-600 dark:text-red-400 text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}