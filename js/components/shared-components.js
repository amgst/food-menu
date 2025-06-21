// Shared Components for MenuCraft

// Prevent duplicate loading
if (typeof window.MenuCraftComponents !== 'undefined') {
    console.log('MenuCraftComponents already loaded, skipping...');
} else {

const { formatCurrency, LoadingSpinner, Icons } = window.MenuCraftUtils || {};

// Checkout Form Component
const CheckoutForm = ({ cart, total, onClose, onSubmit }) => {
    const [formData, setFormData] = React.useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        specialInstructions: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.phone.trim()) {
            alert('Please fill in required fields (Name and Phone)');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            alert('Error placing order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return React.createElement('div', { 
        className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' 
    },
        React.createElement('div', { 
            className: 'bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto' 
        },
            React.createElement('div', { className: 'p-4 border-b' },
                React.createElement('div', { className: 'flex justify-between items-center' },
                    React.createElement('h2', { className: 'text-xl font-semibold' }, 'Checkout'),
                    React.createElement('button', {
                        onClick: onClose,
                        className: 'text-gray-500 hover:text-gray-700 text-2xl'
                    }, '✕')
                )
            ),

            React.createElement('form', { onSubmit: handleSubmit, className: 'p-4' },
                React.createElement('div', { className: 'mb-6' },
                    React.createElement('h3', { className: 'font-semibold mb-3' }, 'Order Summary'),
                    React.createElement('div', { className: 'max-h-32 overflow-y-auto space-y-1' },
                        cart.map(item =>
                            React.createElement('div', {
                                key: item.id,
                                className: 'flex justify-between text-sm py-1'
                            },
                                React.createElement('span', null, `${item.name} x${item.quantity}`),
                                React.createElement('span', null, formatCurrency ? formatCurrency(item.price * item.quantity) : `$${(item.price * item.quantity).toFixed(2)}`)
                            )
                        )
                    ),
                    React.createElement('div', { 
                        className: 'border-t mt-3 pt-3 flex justify-between font-semibold' 
                    },
                        React.createElement('span', null, 'Total:'),
                        React.createElement('span', { className: 'text-orange-600' }, formatCurrency ? formatCurrency(total) : `$${total.toFixed(2)}`)
                    )
                ),

                React.createElement('div', { className: 'space-y-4' },
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Name *'),
                        React.createElement('input', {
                            type: 'text',
                            required: true,
                            value: formData.name,
                            onChange: (e) => setFormData({...formData, name: e.target.value}),
                            className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                            placeholder: 'Your full name'
                        })
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Phone *'),
                        React.createElement('input', {
                            type: 'tel',
                            required: true,
                            value: formData.phone,
                            onChange: (e) => setFormData({...formData, phone: e.target.value}),
                            className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                            placeholder: 'Your phone number'
                        })
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Email'),
                        React.createElement('input', {
                            type: 'email',
                            value: formData.email,
                            onChange: (e) => setFormData({...formData, email: e.target.value}),
                            className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                            placeholder: 'your@email.com'
                        })
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Address'),
                        React.createElement('input', {
                            type: 'text',
                            value: formData.address,
                            onChange: (e) => setFormData({...formData, address: e.target.value}),
                            className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                            placeholder: 'Delivery address'
                        })
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Special Instructions'),
                        React.createElement('textarea', {
                            value: formData.specialInstructions,
                            onChange: (e) => setFormData({...formData, specialInstructions: e.target.value}),
                            className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                            rows: 3,
                            placeholder: 'Any special requests...'
                        })
                    )
                ),

                React.createElement('div', { className: 'mt-6 flex gap-4' },
                    React.createElement('button', {
                        type: 'button',
                        onClick: onClose,
                        disabled: isSubmitting,
                        className: 'flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50'
                    }, 'Back'),
                    React.createElement('button', {
                        type: 'submit',
                        disabled: isSubmitting,
                        className: 'flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50'
                    }, isSubmitting ? 'Placing Order...' : 'Place Order')
                )
            )
        )
    );
};

// Menu Item Form Component
const MenuItemForm = ({ item, onSubmit, onClose }) => {
    const { CATEGORIES } = window.MenuCraftUtils || {};
    const categories = CATEGORIES ? CATEGORIES.filter(cat => cat.id !== 'all') : [
        { id: 'appetizers', name: 'Appetizers' },
        { id: 'pizza', name: 'Pizza' },
        { id: 'desserts', name: 'Desserts' }
    ];

    const [formData, setFormData] = React.useState({
        name: item?.name || '',
        description: item?.description || '',
        price: item?.price || '',
        category: item?.category || 'appetizers',
        vegetarian: item?.vegetarian || false,
        spicy: item?.spicy || false,
        inStock: item?.inStock !== undefined ? item.inStock : true
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.description.trim() || !formData.price) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            await onSubmit({
                ...formData,
                price: parseFloat(formData.price)
            });
        } catch (error) {
            alert('Error saving item. Please try again.');
        }
    };

    return React.createElement('div', { 
        className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' 
    },
        React.createElement('div', { 
            className: 'bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto' 
        },
            React.createElement('div', { className: 'p-6' },
                React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                    React.createElement('h2', { className: 'text-xl font-semibold' }, 
                        item ? 'Edit Menu Item' : 'Add New Menu Item'
                    ),
                    React.createElement('button', {
                        onClick: onClose,
                        className: 'text-gray-500 hover:text-gray-700 text-2xl'
                    }, '✕')
                ),

                React.createElement('form', { onSubmit: handleSubmit, className: 'space-y-4' },
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Name *'),
                        React.createElement('input', {
                            type: 'text',
                            required: true,
                            value: formData.name,
                            onChange: (e) => setFormData({...formData, name: e.target.value}),
                            className: 'w-full border rounded-lg px-3 py-2',
                            placeholder: 'Enter item name'
                        })
                    ),

                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Description *'),
                        React.createElement('textarea', {
                            required: true,
                            value: formData.description,
                            onChange: (e) => setFormData({...formData, description: e.target.value}),
                            className: 'w-full border rounded-lg px-3 py-2',
                            rows: 3
                        })
                    ),

                    React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Price *'),
                            React.createElement('input', {
                                type: 'number',
                                required: true,
                                min: '0',
                                step: '0.01',
                                value: formData.price,
                                onChange: (e) => setFormData({...formData, price: e.target.value}),
                                className: 'w-full border rounded-lg px-3 py-2'
                            })
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Category *'),
                            React.createElement('select', {
                                value: formData.category,
                                onChange: (e) => setFormData({...formData, category: e.target.value}),
                                className: 'w-full border rounded-lg px-3 py-2'
                            }, categories.map(cat =>
                                React.createElement('option', { key: cat.id, value: cat.id }, cat.name)
                            ))
                        )
                    ),

                    React.createElement('div', { className: 'space-y-3' },
                        React.createElement('label', { className: 'flex items-center' },
                            React.createElement('input', {
                                type: 'checkbox',
                                checked: formData.vegetarian,
                                onChange: (e) => setFormData({...formData, vegetarian: e.target.checked}),
                                className: 'mr-3'
                            }),
                            React.createElement('span', { className: 'text-sm' }, '🌱 Vegetarian')
                        ),
                        React.createElement('label', { className: 'flex items-center' },
                            React.createElement('input', {
                                type: 'checkbox',
                                checked: formData.spicy,
                                onChange: (e) => setFormData({...formData, spicy: e.target.checked}),
                                className: 'mr-3'
                            }),
                            React.createElement('span', { className: 'text-sm' }, '🌶️ Spicy')
                        ),
                        React.createElement('label', { className: 'flex items-center' },
                            React.createElement('input', {
                                type: 'checkbox',
                                checked: formData.inStock,
                                onChange: (e) => setFormData({...formData, inStock: e.target.checked}),
                                className: 'mr-3'
                            }),
                            React.createElement('span', { className: 'text-sm' }, '✅ In Stock')
                        )
                    ),

                    React.createElement('div', { className: 'flex gap-4 mt-6' },
                        React.createElement('button', {
                            type: 'button',
                            onClick: onClose,
                            className: 'flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300'
                        }, 'Cancel'),
                        React.createElement('button', {
                            type: 'submit',
                            className: 'flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600'
                        }, item ? 'Update Item' : 'Add Item')
                    )
                )
            )
        )
    );
};

// Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return React.createElement('div', {
        className: 'flex items-center gap-3 p-3 bg-gray-50 rounded-lg'
    },
        React.createElement('div', { className: 'flex-1' },
            React.createElement('h4', { className: 'font-medium text-sm' }, item.name),
            React.createElement('p', { className: 'text-gray-600 text-xs' }, `$${item.price} each`)
        ),
        React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('button', {
                onClick: () => onUpdateQuantity(item.id, -1),
                className: 'text-gray-500 hover:text-gray-700 p-1'
            }, '−'),
            React.createElement('span', { className: 'font-medium text-sm w-6 text-center' }, item.quantity),
            React.createElement('button', {
                onClick: () => onUpdateQuantity(item.id, 1),
                className: 'text-gray-500 hover:text-gray-700 p-1'
            }, '+'),
            React.createElement('button', {
                onClick: () => onRemove(item.id),
                className: 'text-red-500 hover:text-red-700 ml-2 p-1'
            }, '🗑️')
        ),
        React.createElement('div', { className: 'font-semibold text-sm' },
            `$${(item.price * item.quantity).toFixed(2)}`
        )
    );
};

// Menu Item Card Component
const MenuItemCard = ({ item, onAddToCart, buttonState, isLoading }) => {
    const getButtonText = () => {
        if (!item.inStock) return 'Out of Stock';
        
        switch (buttonState) {
            case 'adding':
                return 'Adding...';
            case 'added':
                return 'Added';
            default:
                return 'Add to Cart';
        }
    };

    const getButtonStyle = () => {
        if (!item.inStock) return 'bg-gray-400 text-white cursor-not-allowed';
        
        switch (buttonState) {
            case 'adding':
                return 'bg-yellow-500 text-white';
            case 'added':
                return 'bg-green-500 text-white';
            default:
                return 'bg-orange-500 text-white hover:bg-orange-600';
        }
    };

    return React.createElement('div', {
        className: `bg-white rounded-lg shadow-sm border hover:shadow-md transition-all ${!item.inStock ? 'opacity-75' : ''}`
    },
        React.createElement('div', { className: 'p-4' },
            React.createElement('div', { className: 'flex justify-between items-start mb-2' },
                React.createElement('h3', { className: 'font-semibold text-gray-800 flex-1 pr-2' }, item.name),
                React.createElement('div', { className: 'flex gap-1' },
                    item.vegetarian && React.createElement('span', { className: 'bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full' }, '🌱'),
                    item.spicy && React.createElement('span', { className: 'bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full' }, '🌶️'),
                    !item.inStock && React.createElement('span', { className: 'bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded-full' }, 'Out of Stock')
                )
            ),
            React.createElement('p', { className: 'text-gray-600 text-sm mb-3' }, item.description),
            React.createElement('div', { className: 'flex flex-col gap-2' },
                React.createElement('span', { className: 'text-xl font-bold text-orange-600' }, `$${item.price}`),
                React.createElement('button', {
                    onClick: () => onAddToCart(item),
                    disabled: isLoading || !item.inStock,
                    className: `w-full px-3 py-2 rounded-lg transition-colors font-medium text-sm ${getButtonStyle()} disabled:opacity-70`
                }, getButtonText())
            )
        )
    );
};

// Category Navigation Component
const CategoryNavigation = ({ categories, selectedCategory, onSelectCategory }) => {
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

    return React.createElement('div', { className: 'bg-white border-b' },
        React.createElement('div', { className: 'max-w-7xl mx-auto px-4 py-4' },
            React.createElement('h2', { className: 'text-xl md:text-2xl font-semibold text-center text-gray-800 mb-6' }, 'Menu Categories'),
            React.createElement('div', { className: 'relative' },
                React.createElement('button', {
                    onClick: () => scrollCategories('left'),
                    className: 'absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50'
                }, '‹'),
                
                React.createElement('div', {
                    id: 'categories-container',
                    className: 'flex gap-3 overflow-x-auto px-8 scroll-smooth hide-scrollbar'
                }, categories.map(category =>
                    React.createElement('button', {
                        key: category.id,
                        onClick: () => onSelectCategory(category.id),
                        className: `flex-shrink-0 p-4 rounded-lg border-2 transition-all text-center min-w-[120px] ${
                            selectedCategory === category.id
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-200 hover:border-orange-300 text-gray-700'
                        }`
                    },
                        React.createElement('div', { className: 'text-2xl mb-2' }, category.icon),
                        React.createElement('div', { className: 'font-medium text-xs' }, category.name)
                    )
                )),

                React.createElement('button', {
                    onClick: () => scrollCategories('right'),
                    className: 'absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50'
                }, '›')
            )
        )
    );
};

// Export components
window.MenuCraftComponents = {
    CheckoutForm,
    MenuItemForm,
    CartItem,
    MenuItemCard,
    CategoryNavigation
};

} // End duplicate loading check