// Pameer Restaurant Menu Data Population Script

// Categories
const PAMEER_CATEGORIES = [
    { name: 'Family Packs', icon: '👨‍👩‍👧‍👦', color: '#dc2626' },
    { name: 'Kebabs', icon: '🍢', color: '#ea580c' },
    { name: 'Kebabs with Rice', icon: '🍚', color: '#d97706' },
    { name: 'Rice Meals', icon: '🍛', color: '#ca8a04' },
    { name: 'Curries', icon: '🍲', color: '#65a30d' },
    { name: 'Specialties', icon: '⭐', color: '#0891b2' },
    { name: 'Sides & Salads', icon: '🥗', color: '#7c3aed' },
    { name: 'Beverages', icon: '🥤', color: '#be185d' }
];

// Menu Items
const PAMEER_MENU_ITEMS = [
    // FAMILY PACKS
    { name: 'Mashawyat Rice Family Pack (Large)', description: '4 lamb shanks with 16 skewers of mixed kebab with rice, 5 breads, salad and sauce. Includes 2 x 1.25L soft drinks. Feeds 10 people', price: 211.99, category: 'family-packs', inStock: true },
    { name: 'Mashawyat Rice Family Pack (Medium)', description: '16 skewers of mixed kebab with rice, 4 breads, salad and sauce. Includes 2 x 1.25L soft drinks. Feeds 8 people', price: 171.99, category: 'family-packs', inStock: true },
    { name: 'Mashawyat Mazdat Family Pack', description: '16 skewers of mixed kebab with 5 breads, salad and sauce. Includes 1.25L soft drink. Feeds 6 people', price: 129.99, category: 'family-packs', inStock: true },
    { name: 'Mashawyat Rice Family Pack (Small)', description: '10 skewers of mixed kebab with rice, 2 breads, salad and sauce. Includes 1.25L soft drink. Feeds 4 people', price: 101.99, category: 'family-packs', inStock: true },
    { name: 'Mashawyat Mazdat (Small)', description: '10 skewers of mixed kebab with 3 breads, salad and sauce. Includes 1.25L soft drink. Feeds 3 people', price: 91.99, category: 'family-packs', inStock: true },
    { name: 'Qabuli Palaw with Lamb Shank Family Pack', description: 'Qabuli Rice with 4 big pieces of lamb shank topped with sultanas and carrot, breads, salad and sauce. Includes 1.25L soft drink. Feeds 5 people', price: 107.99, category: 'family-packs', inStock: true },
    { name: 'Charcoal Chicken Rice Family Pack', description: 'Big plate of 3 whole chickens with rice, 3 breads, salad and sauce. Includes 1.25L soft drink. Feeds 8 people', price: 108.99, category: 'family-packs', inStock: true },

    // KEBABS
    { name: 'Mix Kebab', description: '3 skewers (chicken, tikka, shami) with bread, salad and sauce. 2 skewers $22.99', price: 26.99, category: 'kebabs', inStock: true },
    { name: 'Tikka Lamb Kebab', description: '3 skewers of tikka lamb with bread, salad and sauce. 2 skewers $20.99, 1 skewer $11.99', price: 27.99, category: 'kebabs', inStock: true },
    { name: 'Chicken Kebab', description: '3 skewers of chicken with bread, salad and sauce. 2 skewers $22.99, 1 skewer $11.99', price: 26.99, category: 'kebabs', inStock: true },
    { name: 'Shami Kebab', description: '3 skewers of Shami with bread, salad and sauce. 2 skewers $19.99, 1 skewer $9.99', price: 23.99, category: 'kebabs', inStock: true },
    { name: 'Chopan Kebab', description: '2 skewers of chopan (tikka lamb with bone) with bread, salad and sauce. 1 skewer $14.99', price: 28.99, category: 'kebabs', inStock: true },
    { name: 'Bamiyan Kebab', description: '2 skewers of bamiyan (chicken with bone) with bread, salad and sauce', price: 21.99, category: 'kebabs', inStock: true },
    { name: 'Charcoal Chicken', description: 'Whole charcoal chicken with 2 breads, 1 salad and 1 sauce. Half charcoal chicken $16.99', price: 25.99, category: 'kebabs', inStock: true },

    // KEBABS WITH RICE
    { name: 'Afghan Chalaw', description: 'Rice with 3 skewers (Chicken, Tikka, Shami) bread, salad and sauce', price: 28.99, category: 'kebabs-with-rice', inStock: true },
    { name: 'Tikka Chalaw', description: 'Rice with 2 skewers of tikka lamb, bread, salad and sauce. 1 skewer with rice $16.99, 3 skewer with rice $33.99', price: 26.99, category: 'kebabs-with-rice', inStock: true },
    { name: 'Chicken Chalaw', description: 'Rice with 2 skewers of chicken, bread, salad and sauce. 1 skewer with rice $15.99', price: 25.99, category: 'kebabs-with-rice', inStock: true },
    { name: 'Chalaw Kebab', description: 'Rice with 2 skewers of shami, bread, salad and sauce. 1 skewer with rice $15.99', price: 24.99, category: 'kebabs-with-rice', inStock: true },
    { name: 'Chopan Chalaw', description: 'Rice with 1 skewer of Chopan (Tikka lamb with bone), bread, salad and sauce', price: 23.99, category: 'kebabs-with-rice', inStock: true },
    { name: 'Bamiyan Chalaw', description: 'Rice with 1 skewer of bamiyan (chicken with bone), bread, salad and sauce', price: 22.99, category: 'kebabs-with-rice', inStock: true },
    { name: 'Charcoal Chicken Rice', description: 'Rice with 1 whole charcoal chicken, bread, 2 salad and 2 sauce. Half charcoal chicken with rice $22.99', price: 33.99, category: 'kebabs-with-rice', inStock: true },

    // RICE MEALS
    { name: 'Qabuli Palaw with Lamb Shank', description: 'Qabuli rice with big piece of lamb shank topped with sultanas and carrot, bread, salad and sauce', price: 27.99, category: 'rice-meals', inStock: true },
    { name: 'Chalaw Ghosht', description: 'Zafran rice with big piece of lamb shank topped with barberry, bread, salad and sauce', price: 27.99, category: 'rice-meals', inStock: true },
    { name: 'Chicken Biryani', description: 'Biryani Rice with hot spices, chicken drumstick, bread, salad and sauce', price: 24.99, category: 'rice-meals', spicy: true, inStock: true },

    // CURRIES
    { name: 'Lamb Curry', description: 'Lamb curry with bread, salad and sauce. With rice $28.99', price: 25.99, category: 'curries', inStock: true },
    { name: 'Chicken Curry', description: 'Chicken curry with bread, salad and sauce. With rice $26.99', price: 23.99, category: 'curries', inStock: true },
    { name: 'Vegetable Curry (Ghormeh Sabzi)', description: 'A mixture of sautéed herbs parsley, leeks or green onions, pieces of lamb and kidney beans with bread, salad and sauce. With rice $24.99', price: 19.99, category: 'curries', inStock: true },
    { name: 'Okra Curry', description: 'Okra curry with bread, salad and sauce. With rice $26.99', price: 23.99, category: 'curries', vegetarian: true, inStock: true },
    { name: 'Cauliflower Curry', description: 'Cauliflower curry with bread, salad and sauce. With rice $25.99', price: 21.99, category: 'curries', vegetarian: true, inStock: true },

    // SPECIALTIES
    { name: 'Grilled Fish', description: 'One whole grilled fish with chips and bread. Grilled fish with rice and bread $19.99', price: 19.99, category: 'specialties', inStock: true },
    { name: 'Single Kebab Roll', description: '1 skewer of your choice wrapped kebab (lamb tikka or chicken or shami) in bread with salad and sauce', price: 11.99, category: 'specialties', inStock: true },
    { name: 'Combo Kebab Roll', description: '2 skewers of your choice wrapped kebab (lamb tikka or chicken or shami) in bread with salad and sauce', price: 20.99, category: 'specialties', inStock: true },
    { name: 'Boloni (Chives)', description: 'Traditional Afghan flatbread filled with chives', price: 11.99, category: 'specialties', vegetarian: true, inStock: true },
    { name: 'Boloni (Potato)', description: 'Traditional Afghan flatbread filled with potato', price: 9.99, category: 'specialties', vegetarian: true, inStock: true },
    { name: 'Manto', description: '10 steamed dumplings filled with lamb mince, spices with lentils and yogurt dressing', price: 25.99, category: 'specialties', inStock: true },
    { name: 'Ashak', description: '10 boiled dumplings filled with chives, topped with a sauce with lentils and yogurt dressing', price: 25.99, category: 'specialties', vegetarian: true, inStock: true },
    { name: 'Eggplant Dish (Borani Banjan)', description: 'Fried eggplant in a spiced tomato sauce served with garlic yoghurt', price: 21.99, category: 'specialties', vegetarian: true, inStock: true },
    { name: 'Soup', description: 'Made of lamb shank and red lentils (available on special occasions)', price: 7.00, category: 'specialties', inStock: false },

    // SIDES & SALADS
    { name: 'Chips (Small)', description: 'Small portion of golden chips', price: 6.00, category: 'sides-salads', vegetarian: true, inStock: true },
    { name: 'Chips (Medium)', description: 'Medium portion of golden chips', price: 7.00, category: 'sides-salads', vegetarian: true, inStock: true },
    { name: 'Chips (Large)', description: 'Large portion of golden chips', price: 8.00, category: 'sides-salads', vegetarian: true, inStock: true },
    { name: 'Sherazi Salad', description: 'Fresh Afghan-style mixed salad', price: 7.00, category: 'sides-salads', vegetarian: true, inStock: true },
    { name: 'Cucumber Yogurt', description: 'Refreshing cucumber mixed with yogurt', price: 7.00, category: 'sides-salads', vegetarian: true, inStock: true },

    // BEVERAGES
    { name: 'Dogh (Yogurt Shake) - Glass', description: 'Traditional yogurt drink served in glass', price: 3.00, category: 'beverages', vegetarian: true, inStock: true },
    { name: 'Dogh (Yogurt Shake) - Jug', description: 'Traditional yogurt drink served in jug', price: 10.00, category: 'beverages', vegetarian: true, inStock: true },
    { name: 'Soft Drink (Can)', description: 'Canned soft drink', price: 3.00, category: 'beverages', vegetarian: true, inStock: true },
    { name: 'Soft Drink (Bottle)', description: 'Bottled soft drink', price: 4.00, category: 'beverages', vegetarian: true, inStock: true },
    { name: 'Soft Drink (Family Bottle)', description: 'Large family size soft drink bottle', price: 5.00, category: 'beverages', vegetarian: true, inStock: true },
    { name: 'Tea (Cup)', description: 'Traditional tea served in cup', price: 1.00, category: 'beverages', vegetarian: true, inStock: true },
    { name: 'Tea (Pot)', description: 'Traditional tea served in pot', price: 5.00, category: 'beverages', vegetarian: true, inStock: true },
    { name: 'Ice Cream', description: 'Traditional ice cream (availability varies)', price: 8.00, category: 'beverages', vegetarian: true, inStock: false }
];

// Population function
async function populatePameerMenu() {
    const firebaseService = new window.FirebaseService();
    
    try {
        console.log('🍽️ Starting Pameer Restaurant menu population...');
        
        // Add categories first
        const categoryMap = {};
        for (let i = 0; i < PAMEER_CATEGORIES.length; i++) {
            const category = PAMEER_CATEGORIES[i];
            const categoryData = {
                ...category,
                order: i,
                isActive: true
            };
            
            const result = await firebaseService.addCategory(categoryData);
            const categoryId = category.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            categoryMap[categoryId] = result.id;
            console.log(`✅ Added category: ${category.name}`);
        }
        
        // Add menu items
        let successCount = 0;
        for (const item of PAMEER_MENU_ITEMS) {
            try {
                const categoryId = categoryMap[item.category] || item.category;
                const itemData = { ...item, category: categoryId };
                
                await firebaseService.addMenuItem(itemData);
                successCount++;
                console.log(`✅ Added item: ${item.name}`);
            } catch (error) {
                console.error(`❌ Failed to add ${item.name}:`, error);
            }
        }
        
        console.log(`🎉 Success! Added ${PAMEER_CATEGORIES.length} categories and ${successCount} items`);
        return { success: true, categoriesAdded: PAMEER_CATEGORIES.length, itemsAdded: successCount };
        
    } catch (error) {
        console.error('❌ Error populating menu:', error);
        throw error;
    }
}

// Make function globally available
window.populatePameerMenu = populatePameerMenu;

console.log('📄 Pameer data script loaded. Run: await populatePameerMenu()');