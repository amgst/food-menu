// Utility functions for MenuCraft

// Prevent duplicate loading
if (typeof window.MenuCraftUtils !== 'undefined') {
    console.log('MenuCraftUtils already loaded, skipping...');
} else {

// Tenant detection utility
const getTenantInfo = () => {
    const hostname = window.location.hostname;
    
    if (hostname.includes('menucraft.co')) {
        const subdomain = hostname.split('.')[0];
        return {
            tenantId: subdomain,
            isCustomDomain: false,
            tenantName: subdomain.charAt(0).toUpperCase() + subdomain.slice(1),
            displayName: subdomain.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        };
    } else if (hostname.includes('localhost') || hostname.includes('netlify')) {
        // Development/demo environment
        return {
            tenantId: 'demo-restaurant',
            isCustomDomain: false,
            tenantName: 'Demo Restaurant',
            displayName: 'Demo Restaurant'
        };
    } else {
        // Custom domain mapping
        const tenantId = hostname.replace(/\./g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        return {
            tenantId: tenantId,
            isCustomDomain: true,
            tenantName: hostname,
            displayName: hostname
        };
    }
};

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
    { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
    { id: 'soups', name: 'Soups', icon: '🍲' },
    { id: 'salads', name: 'Salads', icon: '🥙' },
    { id: 'pasta', name: 'Pasta', icon: '🍝' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'seafood', name: 'Seafood', icon: '🦞' },
    { id: 'meat', name: 'Meat & Poultry', icon: '🥩' },
    { id: 'vegetarian', name: 'Vegetarian', icon: '🥕' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
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