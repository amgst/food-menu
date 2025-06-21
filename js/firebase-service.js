// Firebase Service Layer for MenuCraft - No Tenant System

// Prevent duplicate loading
if (typeof window.FirebaseService !== 'undefined') {
    console.log('FirebaseService already loaded, skipping...');
} else {

// Firebase service layer
class FirebaseService {
    constructor() {
        this.db = window.db;
        this.auth = window.auth;
        this.storage = window.storage;
    }

    // ==================== CATEGORIES ====================
    
    /**
     * Get all categories
     * @returns {Promise<Array>} Array of categories
     */
    async getCategories() {
        try {
            const snapshot = await this.db.collection('categories')
                .orderBy('order', 'asc')
                .get();
            
            const categories = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    /**
     * Add a new category
     * @param {Object} category - Category data
     * @returns {Promise<Object>} Created category
     */
    async addCategory(category) {
        try {
            const categoryData = {
                name: category.name.trim(),
                icon: category.icon || '🍽️',
                color: category.color || '#f97316',
                order: category.order || 0,
                isActive: category.isActive !== undefined ? Boolean(category.isActive) : true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await this.db.collection('categories').add(categoryData);
            
            return {
                id: docRef.id,
                ...categoryData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        } catch (error) {
            console.error('Error adding category:', error);
            throw new Error('Failed to add category. Please try again.');
        }
    }

    /**
     * Update a category
     * @param {string} id - Category ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<void>}
     */
    async updateCategory(id, updates) {
        try {
            const updateData = {
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await this.db.collection('categories').doc(id).update(updateData);
        } catch (error) {
            console.error('Error updating category:', error);
            throw new Error('Failed to update category. Please try again.');
        }
    }

    /**
     * Delete a category
     * @param {string} id - Category ID
     * @returns {Promise<void>}
     */
    async deleteCategory(id) {
        try {
            // Check if any menu items use this category
            const itemsSnapshot = await this.db.collection('menuItems')
                .where('category', '==', id)
                .limit(1)
                .get();

            if (!itemsSnapshot.empty) {
                throw new Error('Cannot delete category that contains menu items. Please move or delete items first.');
            }

            await this.db.collection('categories').doc(id).delete();
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }

    /**
     * Initialize default categories
     * @returns {Promise<Array>} Array of created categories
     */
    async initializeDefaultCategories() {
        try {
            const defaultCategories = this.getDefaultCategories();
            const createdCategories = [];

            for (let i = 0; i < defaultCategories.length; i++) {
                const category = defaultCategories[i];
                const categoryData = {
                    ...category,
                    order: i,
                    isActive: true,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                const docRef = await this.db.collection('categories').add(categoryData);
                createdCategories.push({
                    id: docRef.id,
                    ...categoryData,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }

            return createdCategories;
        } catch (error) {
            console.error('Error initializing default categories:', error);
            return this.getDefaultCategories();
        }
    }

    /**
     * Get default categories
     * @returns {Array} Default categories
     */
    getDefaultCategories() {
        return [
            { name: 'Appetizers', icon: '🥗', color: '#10b981' },
            { name: 'Soups', icon: '🍲', color: '#f59e0b' },
            { name: 'Salads', icon: '🥙', color: '#22c55e' },
            { name: 'Pasta', icon: '🍝', color: '#eab308' },
            { name: 'Pizza', icon: '🍕', color: '#ef4444' },
            { name: 'Seafood', icon: '🦞', color: '#3b82f6' },
            { name: 'Meat & Poultry', icon: '🥩', color: '#dc2626' },
            { name: 'Vegetarian', icon: '🥕', color: '#16a34a' },
            { name: 'Desserts', icon: '🍰', color: '#ec4899' },
            { name: 'Beverages', icon: '🥤', color: '#06b6d4' }
        ];
    }
    
    // ==================== MENU ITEMS ====================
    
    /**
     * Get all menu items
     * @param {string|null} category - Filter by category
     * @returns {Promise<Array>} Array of menu items
     */
    async getMenuItems(category = null) {
        try {
            let query = this.db.collection('menuItems');
            
            if (category && category !== 'all') {
                query = query.where('category', '==', category);
            }
            
            const snapshot = await query.orderBy('name').get();
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return items;
        } catch (error) {
            console.error('Error fetching menu items:', error);
            throw new Error('Failed to load menu items. Please try again.');
        }
    }

    /**
     * Add a new menu item
     * @param {Object} item - Menu item data
     * @returns {Promise<Object>} Created item with ID
     */
    async addMenuItem(item) {
        try {
            // Validate required fields
            if (!item.name || !item.description || !item.price || !item.category) {
                throw new Error('Missing required fields: name, description, price, and category are required.');
            }

            const itemData = {
                name: item.name.trim(),
                description: item.description.trim(),
                price: parseFloat(item.price),
                category: item.category,
                vegetarian: Boolean(item.vegetarian),
                spicy: Boolean(item.spicy),
                inStock: item.inStock !== undefined ? Boolean(item.inStock) : true,
                imageUrl: item.imageUrl || null,
                allergens: item.allergens || [],
                nutritionalInfo: item.nutritionalInfo || null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await this.db.collection('menuItems').add(itemData);
            
            return {
                id: docRef.id,
                ...itemData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        } catch (error) {
            console.error('Error adding menu item:', error);
            throw new Error(error.message || 'Failed to add menu item. Please try again.');
        }
    }

    /**
     * Update an existing menu item
     * @param {string} id - Item ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<void>}
     */
    async updateMenuItem(id, updates) {
        try {
            const updateData = {
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Clean up undefined values
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });

            await this.db.collection('menuItems').doc(id).update(updateData);
        } catch (error) {
            console.error('Error updating menu item:', error);
            throw new Error('Failed to update menu item. Please try again.');
        }
    }

    /**
     * Delete a menu item
     * @param {string} id - Item ID
     * @returns {Promise<void>}
     */
    async deleteMenuItem(id) {
        try {
            await this.db.collection('menuItems').doc(id).delete();
        } catch (error) {
            console.error('Error deleting menu item:', error);
            throw new Error('Failed to delete menu item. Please try again.');
        }
    }

    /**
     * Toggle item stock status
     * @param {string} id - Item ID
     * @param {boolean} inStock - New stock status
     * @returns {Promise<void>}
     */
    async toggleItemStock(id, inStock) {
        try {
            await this.updateMenuItem(id, { inStock });
        } catch (error) {
            console.error('Error toggling item stock:', error);
            throw error;
        }
    }

    // ==================== ORDERS ====================

    /**
     * Create a new order
     * @param {Object} order - Order data
     * @returns {Promise<Object>} Created order with ID
     */
    async createOrder(order) {
        try {
            // Validate order data
            if (!order.customerInfo || !order.items || order.items.length === 0) {
                throw new Error('Invalid order data: customer info and items are required.');
            }

            const orderData = {
                customerInfo: {
                    name: order.customerInfo.name?.trim(),
                    phone: order.customerInfo.phone?.trim(),
                    email: order.customerInfo.email?.trim() || null,
                    address: order.customerInfo.address?.trim() || null
                },
                items: order.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: parseFloat(item.price),
                    quantity: parseInt(item.quantity)
                })),
                total: parseFloat(order.total),
                specialInstructions: order.specialInstructions?.trim() || null,
                status: 'pending',
                orderNumber: this.generateOrderNumber(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await this.db.collection('orders').add(orderData);
            
            return {
                id: docRef.id,
                ...orderData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error(error.message || 'Failed to create order. Please try again.');
        }
    }

    /**
     * Get orders
     * @param {number} limit - Number of orders to fetch
     * @param {string} status - Filter by status
     * @returns {Promise<Array>} Array of orders
     */
    async getOrders(limit = 50, status = null) {
        try {
            let query = this.db.collection('orders');
            
            if (status) {
                query = query.where('status', '==', status);
            }
            
            query = query.orderBy('createdAt', 'desc').limit(limit);
            
            const snapshot = await query.get();
            const orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return orders;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Failed to load orders. Please try again.');
        }
    }

    /**
     * Update order status
     * @param {string} id - Order ID
     * @param {string} status - New status
     * @returns {Promise<void>}
     */
    async updateOrderStatus(id, status) {
        try {
            const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
            
            if (!validStatuses.includes(status)) {
                throw new Error('Invalid order status');
            }

            await this.db.collection('orders').doc(id).update({
                status,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating order status:', error);
            throw new Error('Failed to update order status. Please try again.');
        }
    }

    // ==================== SETTINGS ====================

    /**
     * Get restaurant settings
     * @returns {Promise<Object>} Settings
     */
    async getSettings() {
        try {
            const doc = await this.db.collection('settings').doc('restaurant').get();
            
            if (doc.exists) {
                return doc.data();
            } else {
                // Return default settings
                return {
                    name: 'My Restaurant',
                    description: '',
                    address: '',
                    phone: '',
                    email: '',
                    logo: null,
                    theme: {
                        primaryColor: '#f97316',
                        accentColor: '#ea580c'
                    },
                    currency: 'USD',
                    timezone: 'UTC',
                    isActive: true
                };
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            throw new Error('Failed to load restaurant settings.');
        }
    }

    /**
     * Update restaurant settings
     * @param {Object} settings - Settings to update
     * @returns {Promise<void>}
     */
    async updateSettings(settings) {
        try {
            const updateData = {
                ...settings,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await this.db.collection('settings').doc('restaurant').set(updateData, { merge: true });
        } catch (error) {
            console.error('Error updating settings:', error);
            throw new Error('Failed to update restaurant settings.');
        }
    }

    // ==================== ANALYTICS ====================

    /**
     * Get basic analytics
     * @param {number} days - Number of days to analyze
     * @returns {Promise<Object>} Analytics data
     */
    async getAnalytics(days = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const ordersSnapshot = await this.db.collection('orders')
                .where('createdAt', '>=', startDate)
                .get();

            const orders = ordersSnapshot.docs.map(doc => doc.data());
            
            const analytics = {
                totalOrders: orders.length,
                totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
                averageOrderValue: 0,
                topItems: this.calculateTopItems(orders),
                ordersByStatus: this.groupOrdersByStatus(orders),
                dailyRevenue: this.calculateDailyRevenue(orders, days)
            };

            analytics.averageOrderValue = analytics.totalOrders > 0 
                ? analytics.totalRevenue / analytics.totalOrders 
                : 0;

            return analytics;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw new Error('Failed to load analytics data.');
        }
    }

    // ==================== HELPER METHODS ====================

    /**
     * Generate a unique order number
     * @returns {string} Order number
     */
    generateOrderNumber() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ORD-${timestamp}${random}`;
    }

    /**
     * Calculate top selling items
     * @param {Array} orders - Orders array
     * @returns {Array} Top items
     */
    calculateTopItems(orders) {
        const itemCounts = {};
        
        orders.forEach(order => {
            if (order.items) {
                order.items.forEach(item => {
                    const key = item.name;
                    if (!itemCounts[key]) {
                        itemCounts[key] = { name: item.name, quantity: 0, revenue: 0 };
                    }
                    itemCounts[key].quantity += item.quantity;
                    itemCounts[key].revenue += item.price * item.quantity;
                });
            }
        });

        return Object.values(itemCounts)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
    }

    /**
     * Group orders by status
     * @param {Array} orders - Orders array
     * @returns {Object} Orders grouped by status
     */
    groupOrdersByStatus(orders) {
        return orders.reduce((groups, order) => {
            const status = order.status || 'pending';
            groups[status] = (groups[status] || 0) + 1;
            return groups;
        }, {});
    }

    /**
     * Calculate daily revenue
     * @param {Array} orders - Orders array
     * @param {number} days - Number of days
     * @returns {Array} Daily revenue data
     */
    calculateDailyRevenue(orders, days) {
        const dailyData = {};
        
        // Initialize all days with 0
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            dailyData[dateKey] = 0;
        }

        // Add actual revenue data
        orders.forEach(order => {
            if (order.createdAt) {
                const orderDate = order.createdAt.toDate ? 
                    order.createdAt.toDate() : 
                    new Date(order.createdAt);
                const dateKey = orderDate.toISOString().split('T')[0];
                
                if (dailyData.hasOwnProperty(dateKey)) {
                    dailyData[dateKey] += order.total || 0;
                }
            }
        });

        return Object.entries(dailyData)
            .map(([date, revenue]) => ({ date, revenue }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
}

// Export FirebaseService
window.FirebaseService = FirebaseService;

} // End duplicate loading check