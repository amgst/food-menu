// Category Management Component for MenuCraft Admin

// Prevent duplicate loading
if (typeof window.CategoryManagement !== 'undefined') {
    console.log('CategoryManagement already loaded, skipping...');
} else {

// Category Form Component
const CategoryForm = ({ category, onSubmit, onClose }) => {
    const [formData, setFormData] = React.useState({
        name: category?.name || '',
        icon: category?.icon || '🍽️',
        color: category?.color || '#f97316',
        isActive: category?.isActive !== undefined ? category.isActive : true
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const commonIcons = [
        '🍽️', '🥗', '🍲', '🥙', '🍝', '🍕', '🦞', '🥩', 
        '🥕', '🍰', '🥤', '🍔', '🌮', '🍜', '🍱', '🥘'
    ];

    const commonColors = [
        '#f97316', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6',
        '#f59e0b', '#22c55e', '#ec4899', '#06b6d4', '#84cc16'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            alert('Please enter a category name');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            alert(error.message || 'Error saving category');
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
            React.createElement('div', { className: 'p-6 border-b' },
                React.createElement('div', { className: 'flex justify-between items-center' },
                    React.createElement('h2', { className: 'text-xl font-semibold' }, 
                        category ? 'Edit Category' : 'Add New Category'
                    ),
                    React.createElement('button', {
                        onClick: onClose,
                        className: 'text-gray-500 hover:text-gray-700 text-2xl'
                    }, '✕')
                )
            ),

            React.createElement('form', { onSubmit: handleSubmit, className: 'p-6 space-y-4' },
                // Name
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Category Name *'),
                    React.createElement('input', {
                        type: 'text',
                        required: true,
                        value: formData.name,
                        onChange: (e) => setFormData({...formData, name: e.target.value}),
                        className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                        placeholder: 'Enter category name'
                    })
                ),

                // Icon Selection
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium mb-2' }, 'Icon'),
                    React.createElement('div', { className: 'grid grid-cols-8 gap-2 mb-2' },
                        commonIcons.map(icon =>
                            React.createElement('button', {
                                key: icon,
                                type: 'button',
                                onClick: () => setFormData({...formData, icon}),
                                className: `p-2 text-xl border rounded hover:bg-gray-50 ${
                                    formData.icon === icon ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                                }`
                            }, icon)
                        )
                    ),
                    React.createElement('input', {
                        type: 'text',
                        value: formData.icon,
                        onChange: (e) => setFormData({...formData, icon: e.target.value}),
                        className: 'w-full border rounded px-2 py-1 text-sm',
                        placeholder: 'Or enter custom emoji'
                    })
                ),

                // Color Selection
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium mb-2' }, 'Color'),
                    React.createElement('div', { className: 'grid grid-cols-5 gap-2 mb-2' },
                        commonColors.map(color =>
                            React.createElement('button', {
                                key: color,
                                type: 'button',
                                onClick: () => setFormData({...formData, color}),
                                className: `w-8 h-8 rounded border-2 ${
                                    formData.color === color ? 'border-gray-800' : 'border-gray-300'
                                }`,
                                style: { backgroundColor: color }
                            })
                        )
                    ),
                    React.createElement('input', {
                        type: 'color',
                        value: formData.color,
                        onChange: (e) => setFormData({...formData, color: e.target.value}),
                        className: 'w-full h-8 border rounded'
                    })
                ),

                // Preview
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium mb-2' }, 'Preview'),
                    React.createElement('div', { 
                        className: 'p-3 border rounded-lg text-center',
                        style: { backgroundColor: formData.color + '20', borderColor: formData.color }
                    },
                        React.createElement('div', { className: 'text-2xl mb-1' }, formData.icon),
                        React.createElement('div', { 
                            className: 'font-medium text-sm',
                            style: { color: formData.color }
                        }, formData.name || 'Category Name')
                    )
                ),

                // Active Status
                React.createElement('label', { className: 'flex items-center cursor-pointer' },
                    React.createElement('input', {
                        type: 'checkbox',
                        checked: formData.isActive,
                        onChange: (e) => setFormData({...formData, isActive: e.target.checked}),
                        className: 'mr-3 h-4 w-4'
                    }),
                    React.createElement('span', { className: 'text-sm' }, 'Active (visible in menu)')
                ),

                // Action Buttons
                React.createElement('div', { className: 'flex gap-4 mt-6' },
                    React.createElement('button', {
                        type: 'button',
                        onClick: onClose,
                        disabled: isSubmitting,
                        className: 'flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50'
                    }, 'Cancel'),
                    React.createElement('button', {
                        type: 'submit',
                        disabled: isSubmitting,
                        className: 'flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50'
                    }, isSubmitting ? 'Saving...' : (category ? 'Update Category' : 'Add Category'))
                )
            )
        )
    );
};

// Category Management Component
const CategoryManagement = ({ firebaseService, onCategoriesChange }) => {
    const [categories, setCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [showForm, setShowForm] = React.useState(false);
    const [editingCategory, setEditingCategory] = React.useState(null);

    React.useEffect(() => {
        loadCategories();
    }, [firebaseService]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const categoriesData = await firebaseService.getCategories();
            setCategories(categoriesData);
            if (onCategoriesChange) {
                onCategoriesChange(categoriesData);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (categoryData) => {
        try {
            await firebaseService.addCategory(categoryData);
            setShowForm(false);
            await loadCategories();
        } catch (error) {
            throw error;
        }
    };

    const handleUpdateCategory = async (id, updates) => {
        try {
            await firebaseService.updateCategory(id, updates);
            setEditingCategory(null);
            await loadCategories();
        } catch (error) {
            throw error;
        }
    };

    const handleDeleteCategory = async (id, name) => {
        if (confirm(`Are you sure you want to delete "${name}" category?`)) {
            try {
                await firebaseService.deleteCategory(id);
                await loadCategories();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleToggleActive = async (category) => {
        try {
            await firebaseService.updateCategory(category.id, { 
                isActive: !category.isActive 
            });
            await loadCategories();
        } catch (error) {
            alert('Error updating category status');
        }
    };

    if (loading) {
        return React.createElement('div', { className: 'flex justify-center py-12' },
            React.createElement('div', { className: 'text-center' },
                React.createElement('div', { className: 'loading-spinner mx-auto mb-4' }),
                React.createElement('p', { className: 'text-gray-600' }, 'Loading categories...')
            )
        );
    }

    if (error) {
        return React.createElement('div', { className: 'bg-red-50 border border-red-200 rounded-lg p-6 text-center' },
            React.createElement('p', { className: 'text-red-800 mb-4' }, error),
            React.createElement('button', {
                onClick: loadCategories,
                className: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
            }, 'Try Again')
        );
    }

    return React.createElement('div', null,
        React.createElement('div', { className: 'flex justify-between items-center mb-6' },
            React.createElement('h3', { className: 'text-xl font-semibold' }, 'Category Management'),
            React.createElement('button', {
                onClick: () => setShowForm(true),
                className: 'bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600'
            }, '+ Add Category')
        ),

        categories.length === 0 ? 
            React.createElement('div', { className: 'text-center py-12' },
                React.createElement('div', { className: 'text-4xl mb-4' }, '📂'),
                React.createElement('h3', { className: 'text-xl font-semibold mb-2' }, 'No Categories'),
                React.createElement('p', { className: 'text-gray-600 mb-6' }, 'Create your first category to organize menu items'),
                React.createElement('button', {
                    onClick: () => setShowForm(true),
                    className: 'bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600'
                }, 'Create First Category')
            ) :
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
                categories.map(category =>
                    React.createElement('div', {
                        key: category.id,
                        className: `bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                            !category.isActive ? 'opacity-60' : ''
                        }`
                    },
                        React.createElement('div', { className: 'flex items-center justify-between mb-3' },
                            React.createElement('div', { className: 'flex items-center gap-3' },
                                React.createElement('div', { 
                                    className: 'text-2xl w-10 h-10 rounded-lg flex items-center justify-center',
                                    style: { backgroundColor: category.color + '20' }
                                }, category.icon),
                                React.createElement('div', null,
                                    React.createElement('h4', { className: 'font-semibold' }, category.name),
                                    React.createElement('p', { className: 'text-xs text-gray-500' }, 
                                        category.isActive ? 'Active' : 'Inactive'
                                    )
                                )
                            ),
                            React.createElement('div', { className: 'flex gap-1' },
                                React.createElement('button', {
                                    onClick: () => handleToggleActive(category),
                                    className: `p-1 rounded hover:bg-gray-100 ${
                                        category.isActive ? 'text-green-600' : 'text-gray-400'
                                    }`,
                                    title: category.isActive ? 'Deactivate' : 'Activate'
                                }, category.isActive ? '✅' : '❌'),
                                React.createElement('button', {
                                    onClick: () => setEditingCategory(category),
                                    className: 'p-1 rounded hover:bg-gray-100 text-blue-600',
                                    title: 'Edit category'
                                }, '✏️'),
                                React.createElement('button', {
                                    onClick: () => handleDeleteCategory(category.id, category.name),
                                    className: 'p-1 rounded hover:bg-gray-100 text-red-600',
                                    title: 'Delete category'
                                }, '🗑️')
                            )
                        ),
                        React.createElement('div', { 
                            className: 'h-2 rounded-full',
                            style: { backgroundColor: category.color + '40' }
                        })
                    )
                )
            ),

        // Add/Edit Form Modal
        (showForm || editingCategory) && React.createElement(CategoryForm, {
            category: editingCategory,
            onSubmit: editingCategory ? 
                (updates) => handleUpdateCategory(editingCategory.id, updates) : 
                handleAddCategory,
            onClose: () => {
                setShowForm(false);
                setEditingCategory(null);
            }
        })
    );
};

// Export component
window.CategoryManagement = CategoryManagement;

} // End duplicate loading check