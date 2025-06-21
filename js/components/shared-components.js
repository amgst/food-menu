// Shared Components for MenuCraft
const { Icons, formatCurrency, LoadingSpinner } = window.MenuCraftUtils;

// ==================== CHECKOUT FORM COMPONENT ====================
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
            console.error('Checkout error:', error);
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
            // Header
            React.createElement('div', { className: 'p-4 border-b' },
                React.createElement('div', { className: 'flex justify-between items-center' },
                    React.createElement('h2', { className: 'text-xl font-semibold' }, 'Checkout'),
                    React.createElement('button', {
                        onClick: onClose,
                        className: 'text-gray-500 hover:text-gray-700 text-2xl'
                    }, React.createElement(Icons.Close))
                )
            ),

            // Form
            React.createElement('form', { onSubmit: handleSubmit, className: 'p-4' },
                // Order Summary
                React.createElement('div', { className: 'mb-6' },
                    React.createElement('h3', { className: 'font-semibold mb-3' }, 'Order Summary'),
                    React.createElement('div', { className: 'max-h-32 overflow-y-auto space-y-1' },
                        cart.map(item =>
                            React.createElement('div', {
                                key: item.id,
                                className: 'flex justify-between text-sm py-1'
                            },
                                React.createElement('span', null, `${item.name} x${item.quantity}`),
                                React.createElement('span', null, formatCurrency(item.price * item.quantity))
                            )
                        )
                    ),
                    React.createElement('div', { 
                        className: 'border-t mt-3 pt-3 flex justify-between font-semibold' 
                    },
                        React.createElement('span', null, 'Total:'),
                        React.createElement('span', { className: 'text-orange-600' }, formatCurrency(total))
                    )
                ),

                // Customer Information
                React.createElement('div', { className: 'space-y-4' },
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Name *'),
                        React.createElement('input', {
                            type: 'text',
                            required: true,
                            value: formData.name,
                            onChange: (e) => setFormData({...formData, name: e.target.value}),
                            className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                            rows: 3,
                            placeholder: 'Any special requests...'
                        })
                    )
                ),

                // Action Buttons
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
                        className: 'flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50'
                    },
                        isSubmitting ? React.createElement(LoadingSpinner, { size: 16 }) : React.createElement(Icons.Check, { size: 16 }),
                        isSubmitting ? 'Placing Order...' : 'Place Order'
                    )
                )
            )
        )
    );
};

// ==================== MENU ITEM FORM COMPONENT ====================
const MenuItemForm = ({ item, onSubmit, onClose }) => {
    const { CATEGORIES } = window.MenuCraftUtils;
    const [formData, setFormData] = React.useState({
        name: item?.name || '',
        description: item?.description || '',
        price: item?.price || '',
        category: item?.category || 'appetizers',
        vegetarian: item?.vegetarian || false,
        spicy: item?.spicy || false,
        inStock: item?.inStock !== undefined ? item.inStock : true
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.description.trim() || !formData.price) {
            alert('Please fill in all required fields');
            return;
        }

        if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            alert('Please enter a valid price');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                price: parseFloat(formData.price)
            });
        } catch (error) {
            console.error('Form submission error:', error);
            alert(error.message || 'Error saving item. Please try again.');
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
            // Header
            React.createElement('div', { className: 'p-6 border-b' },
                React.createElement('div', { className: 'flex justify-between items-center' },
                    React.createElement('h2', { className: 'text-xl font-semibold' }, 
                        item ? 'Edit Menu Item' : 'Add New Menu Item'
                    ),
                    React.createElement('button', {
                        onClick: onClose,
                        className: 'text-gray-500 hover:text-gray-700 text-2xl'
                    }, React.createElement(Icons.Close))
                )
            ),

            // Form
            React.createElement('form', { onSubmit: handleSubmit, className: 'p-6 space-y-4' },
                // Name
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Name *'),
                    React.createElement('input', {
                        type: 'text',
                        required: true,
                        value: formData.name,
                        onChange: (e) => setFormData({...formData, name: e.target.value}),
                        className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                        placeholder: 'Enter item name'
                    })
                ),

                // Description
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Description *'),
                    React.createElement('textarea', {
                        required: true,
                        value: formData.description,
                        onChange: (e) => setFormData({...formData, description: e.target.value}),
                        className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                        placeholder: 'Enter item description',
                        rows: 3
                    })
                ),

                // Price and Category
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
                            className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                            placeholder: '0.00'
                        })
                    ),

                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Category *'),
                        React.createElement('select', {
                            value: formData.category,
                            onChange: (e) => setFormData({...formData, category: e.target.value}),
                            className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500'
                        }, CATEGORIES.filter(cat => cat.id !== 'all').map(cat =>
                            React.createElement('option', { key: cat.id, value: cat.id }, cat.name)
                        ))
                    )
                ),

                // Checkboxes
                React.createElement('div', { className: 'space-y-3' },
                    React.createElement('label', { className: 'flex items-center cursor-pointer' },
                        React.createElement('input', {
                            type: 'checkbox',
                            checked: formData.vegetarian,
                            onChange: (e) => setFormData({...formData, vegetarian: e.target.checked}),
                            className: 'mr-3 h-4 w-4 text-orange-600'
                        }),
                        React.createElement('span', { className: 'text-sm' }, '🌱 Vegetarian')
                    ),

                    React.createElement('label', { className: 'flex items-center cursor-pointer' },
                        React.createElement('input', {
                            type: 'checkbox',
                            checked: formData.spicy,
                            onChange: (e) => setFormData({...formData, spicy: e.target.checked}),
                            className: 'mr-3 h-4 w-4 text-orange-600'
                        }),
                        React.createElement('span', { className: 'text-sm' }, '🌶️ Spicy')
                    ),

                    React.createElement('label', { className: 'flex items-center cursor-pointer' },
                        React.createElement('input', {
                            type: 'checkbox',
                            checked: formData.inStock,
                            onChange: (e) => setFormData({...formData, inStock: e.target.checked}),
                            className: 'mr-3 h-4 w-4 text-orange-600'
                        }),
                        React.createElement('span', { className: 'text-sm' }, '✅ In Stock')
                    )
                ),

                // Action Buttons
                React.createElement('div', { className: 'flex gap-4 mt-6' },
                    React.createElement('button', {
                        type: 'button',
                        onClick: onClose,
                        disabled: isSubmitting,
                        className: 'flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50'
                    }, 'Cancel'),
                    React.createElement('button', {
                        type: 'submit',
                        disabled: isSubmitting,
                        className: 'flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50'
                    },
                        isSubmitting ? React.createElement(LoadingSpinner, { size: 16 }) : null,
                        isSubmitting ? 'Saving...' : (item ? 'Update Item' : 'Add Item')
                    )
                )
            )
        )
    );
};

// ==================== CART ITEM COMPONENT ====================
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return React.createElement('div', {
        className: 'flex items-center gap-3 p-3 bg-gray-50 rounded-lg'
    },
        React.createElement('div', { className: 'flex-1 min-w-0' },
            React.createElement('h4', { className: 'font-medium text-sm truncate' }, item.name),
            React.createElement('p', { className: 'text-gray-600 text-xs' }, `${formatCurrency(item.price)} each`)
        ),
        React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('button', {
                onClick: () => onUpdateQuantity(item.id, -1),
                className: 'text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-200 rounded'
            }, React.createElement(Icons.Minus, { size: 14 })),
            React.createElement('span', { className: 'font-medium text-sm w-6 text-center' }, item.quantity),
            React.createElement('button', {
                onClick: () => onUpdateQuantity(item.id, 1),
                className: 'text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-200 rounded'
            }, React.createElement(Icons.Plus, { size: 14 })),
            React.createElement('button', {
                onClick: () => onRemove(item.id),
                className: 'text-red-500 hover:text-red-700 ml-2 p-1 hover:bg-red-100 rounded'
            }, React.createElement(Icons.Trash2, { size: 14 }))
        ),
        React.createElement('div', { className: 'font-semibold text-sm text-right min-w-[60px]' },
            formatCurrency(item.price * item.quantity)
        )
    );
};

// ==================== MENU ITEM CARD COMPONENT ====================
const MenuItemCard = ({ item, onAddToCart, buttonState, isLoading }) => {
    const getButtonText = () => {
        if (!item.inStock) return 'Out of Stock';
        
        switch (buttonState) {
            case 'adding':
                return 'Adding...';
            case 'added':
                return `Added`;
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
        className: `bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 ${!item.inStock ? 'opacity-75' : ''}`
    },
        React.createElement('div', { className: 'p-3 md:p-4' },
            // Header with name and badges
            React.createElement('div', { className: 'flex justify-between items-start mb-2' },
                React.createElement('h3', { 
                    className: 'font-semibold text-sm md:text-base text-gray-800 flex-1 pr-2 leading-tight' 
                }, item.name),
                React.createElement('div', { className: 'flex gap-1 flex-shrink-0' },
                    item.vegetarian && React.createElement('span', { 
                        className: 'bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full' 
                    }, '🌱'),
                    item.spicy && React.createElement('span', { 
                        className: 'bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full' 
                    }, '🌶️'),
                    !item.inStock && React.createElement('span', { 
                        className: 'bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded-full' 
                    }, 'Out of Stock')
                )
            ),
            
            // Description
            React.createElement('p', { 
                className: 'text-gray-600 text-xs md:text-sm mb-3 leading-relaxed' 
            }, item.description),
            
            // Price and button
            React.createElement('div', { className: 'flex flex-col gap-2' },
                React.createElement('span', { 
                    className: 'text-lg md:text-xl font-bold text-orange-600' 
                }, formatCurrency(item.price)),
                React.createElement('button', {
                    onClick: () => onAddToCart(item),
                    disabled: isLoading || !item.inStock,
                    className: `w-full px-3 py-2 rounded-lg transition-colors font-medium text-xs md:text-sm ${getButtonStyle()} disabled:opacity-70`
                }, 
                    isLoading ? React.createElement(LoadingSpinner, { size: 16 }) : getButtonText()
                )
            )
        )
    );
};

// ==================== CATEGORY NAVIGATION COMPONENT ====================
const CategoryNavigation = ({ categories, selectedCategory, onSelectCategory }) => {
    const { scrollCategories, Icons } = window.MenuCraftUtils;

    return React.createElement('div', { className: 'bg-white border-b' },
        React.createElement('div', { className: 'max-w-7xl mx-auto px-4 py-4' },
            React.createElement('h2', { 
                className: 'text-xl md:text-2xl font-semibold text-center text-gray-800 mb-6' 
            }, 'Menu Categories'),
            React.createElement('div', { className: 'relative' },
                // Left arrow
                React.createElement('button', {
                    onClick: () => scrollCategories('left'),
                    className: 'absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50'
                }, React.createElement(Icons.ChevronLeft, { size: 20 })),
                
                // Categories container
                React.createElement('div', {
                    id: 'categories-container',
                    className: 'flex gap-3 overflow-x-auto px-8 scroll-smooth hide-scrollbar'
                }, categories.map(category =>
                    React.createElement('button', {
                        key: category.id,
                        onClick: () => onSelectCategory(category.id),
                        className: `flex-shrink-0 p-3 md:p-4 rounded-lg border-2 transition-all text-center min-w-[100px] md:min-w-[120px] ${
                            selectedCategory === category.id
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-200 hover:border-orange-300 text-gray-700'
                        }`
                    },
                        React.createElement('div', { className: 'text-xl md:text-2xl mb-1 md:mb-2' }, category.icon),
                        React.createElement('div', { className: 'font-medium text-xs whitespace-nowrap' }, category.name)
                    )
                )),

                // Right arrow
                React.createElement('button', {
                    onClick: () => scrollCategories('right'),
                    className: 'absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50'
                }, React.createElement(Icons.ChevronRight, { size: 20 }))
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
};',
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
                            className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500