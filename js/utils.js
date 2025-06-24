// Utility functions for MenuCraft

// Prevent duplicate loading
if (typeof window.MenuCraftUtils !== 'undefined') {
    console.log('MenuCraftUtils already loaded, skipping...');
} else {

// Restaurant info - Updated for Pameer Restaurant
const getTenantInfo = () => {
    return {
        tenantId: 'pameer-restaurant',
        name: 'Pameer Restaurant',
        displayName: 'Pameer Restaurant',
        description: 'Authentic Afghan Cuisine in Blacktown',
        address: '110 Main Street Blacktown NSW 2148',
        phone: '0451 130 729',
        alternatePhone: '0404 777 738',
        website: 'www.pameerresturant.com',
        instagram: 'www.instagram.com/pameerrestaurant1/',
        facebook: 'www.facebook.com/Pameerrestaurant/',
        isHalal: true,
        cateringAvailable: true
    };
};

// Keep backward compatibility
const getRestaurantInfo = getTenantInfo;

// Simple icon components (React elements)
const Icons = {
    ChevronLeft: ({ size = 20 }) => React.createElement('span', { 
        style: { fontSize: size + 'px', fontWeight: 'bold' } 
    }, '‹'),
    
    ChevronRight: ({ size = 20 }) => React.createElement('span', { 
        style: { fontSize: size + 'px', fontWeight: 'bold' } 
    }, '›'),
    
    Plus: ({ size = 16 }) => React.createElement('span', { 
        style: { fontSize: size + 'px' } 
    }, '+'),
    
    Minus: ({ size = 16 }) => React.createElement('span', { 
        style: { fontSize: size + 'px' } 
    }, '−'),
    
    Trash2: ({ size = 16 }) => React.createElement('span', { 
        style: { fontSize: size + 'px' } 
    }, '🗑️'),
    
    Check: ({ size = 16 }) => React.createElement('span', { 
        style: { fontSize: size + 'px' } 
    }, '✓'),
    
    Settings: ({ size = 16 }) => React.createElement('span', { 
        style: { fontSize: size + 'px' } 
    }, '⚙️'),
    
    Edit: ({ size = 16 }) => React.createElement('span', { 
        style: { fontSize: size + 'px' } 
    }, '✏️'),
    
    User: ({ size = 16 }) => React.createElement('span', { 
        style: { fontSize: size + 'px' } 
    }, '👤'),
    
    Menu: ({ size = 16 }) => React.createElement('span', { 
        style: { fontSize: size + 'px' } 
    }, '☰'),
    
    Close: ({ size = 16 }) => React.createElement('span', { 
        style: { fontSize: size + 'px' } 
    }, '✕')
};

// Format currency
const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
};

// Format date
const formatDate = (date) => {
    if (!date) return '';
    
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Category definitions - now dynamic, loaded from Firebase
const DEFAULT_CATEGORIES = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'family-packs', name: 'Family Packs', icon: '👨‍👩‍👧‍👦' },
    { id: 'kebabs', name: 'Kebabs', icon: '🍢' },
    { id: 'kebabs-with-rice', name: 'Kebabs with Rice', icon: '🍚' },
    { id: 'rice-meals', name: 'Rice Meals', icon: '🍛' },
    { id: 'curries', name: 'Curries', icon: '🍲' },
    { id: 'specialties', name: 'Specialties', icon: '⭐' },
    { id: 'sides-salads', name: 'Sides & Salads', icon: '🥗' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' }
];

// Load categories from Firebase
const loadCategories = async (firebaseService) => {
    try {
        const categories = await firebaseService.getCategories();
        // Add "All Items" category at the beginning
        return [
            { id: 'all', name: 'All Items', icon: '🍽️', order: -1 },
            ...categories
        ];
    } catch (error) {
        console.error('Error loading categories:', error);
        return DEFAULT_CATEGORIES;
    }
};

// Loading spinner component
const LoadingSpinner = ({ size = 24 }) => {
    return React.createElement('div', {
        className: 'loading-spinner',
        style: {
            width: size + 'px',
            height: size + 'px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #f97316',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }
    });
};

// Error message component
const ErrorMessage = ({ message, onRetry }) => {
    return React.createElement('div', {
        className: 'bg-red-50 border border-red-200 rounded-lg p-4 text-center'
    },
        React.createElement('p', { className: 'text-red-800 mb-2' }, message),
        onRetry && React.createElement('button', {
            onClick: onRetry,
            className: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
        }, 'Try Again')
    );
};

// Empty state component
const EmptyState = ({ title, message, actionText, onAction }) => {
    return React.createElement('div', {
        className: 'text-center py-12'
    },
        React.createElement('div', { className: 'text-6xl mb-4' }, '📝'),
        React.createElement('h3', { className: 'text-xl font-semibold text-gray-800 mb-2' }, title),
        React.createElement('p', { className: 'text-gray-600 mb-6' }, message),
        onAction && React.createElement('button', {
            onClick: onAction,
            className: 'bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600'
        }, actionText)
    );
};

// Scroll categories utility
const scrollCategories = (direction) => {
    const container = document.getElementById('categories-container');
    if (container) {
        const scrollAmount = 200;
        if (direction === 'left') {
            container.scrollLeft -= scrollAmount;
        } else {
            container.scrollLeft += scrollAmount;
        }
    }
};

// Form validation utilities
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return re.test(phone);
};

// Local storage utilities
const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

const getFromLocalStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
};

// Export utilities
window.MenuCraftUtils = {
    getTenantInfo,
    getRestaurantInfo, // Keep for backward compatibility
    Icons,
    formatCurrency,
    formatDate,
    DEFAULT_CATEGORIES,
    loadCategories,
    LoadingSpinner,
    ErrorMessage,
    EmptyState,
    scrollCategories,
    validateEmail,
    validatePhone,
    saveToLocalStorage,
    getFromLocalStorage
};

} // End duplicate loading check