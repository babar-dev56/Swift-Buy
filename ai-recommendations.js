// AI-Driven Recommendation Engine for SwiftBuy
// Tracks user behavior and provides personalized recommendations

// Product Database
const PRODUCT_DATABASE = {
    "Lenovo IdeaPad 3": {
        name: "Lenovo IdeaPad 3",
        price: 80000,
        category: "Electronics",
        subcategory: "Laptops",
        image: "https://static3.webx.pk/files/19643/Images/lenovo-ideapad-3-15iau7-laptop-price-in-pakistan-2-19643-0-100124121714584.jpg",
        rating: 4,
        tags: ["laptop", "computer", "electronics", "lenovo", "work", "gaming"]
    },
    "Hyper X Cloud 2 (HeadPhones)": {
        name: "Hyper X Cloud 2 (HeadPhones)",
        price: 25000,
        category: "Electronics",
        subcategory: "Audio",
        image: "https://thegamesmen.pk/wp-content/uploads/2024/08/hyperx_cloud_ii_red_2_main_mixer_900x.webp",
        rating: 5,
        tags: ["headphones", "audio", "gaming", "hyperx", "music"]
    },
    "Rechargeable Fan With Led": {
        name: "Rechargeable Fan With Led",
        price: 3500,
        category: "Electronics",
        subcategory: "Home Appliances",
        image: "https://imports.pk/cdn/shop/files/GeepasRechargeableFanWithLEDLightGF21162_41f4e611-b51a-4949-add5-be3163cb4a02.jpg?v=1716910625",
        rating: 3,
        tags: ["fan", "cooling", "led", "rechargeable", "home"]
    },
    "Hair Dryer": {
        name: "Hair Dryer",
        price: 4500,
        category: "Electronics",
        subcategory: "Personal Care",
        image: "https://bestonline.pk/cdn/shop/products/3e9f4ab8-3c53-41ef-a7ab-b41e4ef581ca.jpg?v=1633600977",
        rating: 5,
        tags: ["hair", "dryer", "personal", "care", "beauty"]
    },
    "Mens Track Suit": {
        name: "Mens Track Suit",
        price: 2200,
        category: "Fashion",
        subcategory: "Clothing",
        image: "https://auagarments.pk/cdn/shop/products/WhatsAppImage2023-12-18at16.10.21_19860bff.jpg?v=1703858528",
        rating: 5,
        tags: ["clothing", "sportswear", "men", "fashion", "suit"]
    },
    "Formal Shirt": {
        name: "Formal Shirt",
        price: 1400,
        category: "Fashion",
        subcategory: "Clothing",
        image: "https://5.imimg.com/data5/YD/AP/LT/ANDROID-102906917/product-jpeg-500x500.jpeg",
        rating: 4,
        tags: ["shirt", "formal", "clothing", "men", "office"]
    },
    "White Casual Suit For Men": {
        name: "White Casual Suit For Men",
        price: 5000,
        category: "Fashion",
        subcategory: "Clothing",
        image: "https://5.imimg.com/data5/SELLER/Default/2022/11/KE/VX/MV/116453489/white-casual-shoes-for-men.jpg",
        rating: 3,
        tags: ["suit", "casual", "men", "clothing", "fashion"]
    },
    "HandBags For Girls": {
        name: "HandBags For Girls",
        price: 3000,
        category: "Fashion",
        subcategory: "Accessories",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJedhJwsNiIYQp76gnU3-XGvlXWVTJ1Rc9JA&s",
        rating: 5,
        tags: ["bag", "handbag", "women", "accessories", "fashion"]
    },
    "Olive Oil": {
        name: "Olive Oil",
        price: 8000,
        category: "Groceries",
        subcategory: "Cooking",
        image: "https://www.jiomart.com/images/product/original/rvqiojwldw/glowocean-extra-virgin-olive-oil-100-pure-olive-oil-product-images-orvqiojwldw-p599265400-0-202303121828.png?im=Resize=(420,420)",
        rating: 4,
        tags: ["oil", "cooking", "groceries", "food", "healthy"]
    },
    "Green Tea Bags (25)": {
        name: "Green Tea Bags (25)",
        price: 1200,
        category: "Groceries",
        subcategory: "Beverages",
        image: "https://www.incity.pk/wp-content/uploads/2021/01/Lipton-green-tea-box-25-bags-2.jpg",
        rating: 5,
        tags: ["tea", "beverage", "lipton", "healthy", "groceries"]
    },
    "Habib Cokking Oil (5L)": {
        name: "Habib Cokking Oil (5L)",
        price: 2750,
        category: "Groceries",
        subcategory: "Cooking",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1vT-AqAfJwRAPlP-rsk3ex3yhJy24u3alZw&s",
        rating: 3,
        tags: ["oil", "cooking", "habib", "groceries", "food"]
    },
    "Basmatti Rice (7 KG)": {
        name: "Basmatti Rice (7 KG)",
        price: 800,
        category: "Groceries",
        subcategory: "Grains",
        image: "https://simplythegreat.com/cdn/shop/products/Untitleddesign-2021-10-03T164457.359.png?v=1633261514",
        rating: 5,
        tags: ["rice", "basmati", "grains", "groceries", "food"]
    },
    "Juicer Blender": {
        name: "Juicer Blender",
        price: 1650,
        category: "Home & Kitchen",
        subcategory: "Appliances",
        image: "https://estore.gabanational.net.pk/cdn/shop/products/9e570dd3-eaf2-435b-b0dc-41fb95ab8c5f.jpg?v=1663063968",
        rating: 5,
        tags: ["blender", "juicer", "kitchen", "appliance", "gaba"]
    },
    "Electric Kettle": {
        name: "Electric Kettle",
        price: 4500,
        category: "Home & Kitchen",
        subcategory: "Appliances",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgINzPBo02sk3xLlUINjwYJ-bA9tIoQKeALg&s",
        rating: 4,
        tags: ["kettle", "electric", "kitchen", "appliance", "tea"]
    },
    "Electric Pressure Cooker": {
        name: "Electric Pressure Cooker",
        price: 2500,
        category: "Home & Kitchen",
        subcategory: "Appliances",
        image: "https://img.drz.lazcdn.com/static/pk/p/0cf2d0a8100bb43d9f3faf4e337e2d7c.jpg_720x720q80.jpg",
        rating: 5,
        tags: ["cooker", "pressure", "electric", "kitchen", "cooking"]
    },
    "Tea Cup Sets 6 Pcs": {
        name: "Tea Cup Sets 6 Pcs",
        price: 1200,
        category: "Home & Kitchen",
        subcategory: "Dining",
        image: "https://homeessentialspk.b-cdn.net/wp-content/uploads/2023/12/IMG-20231216-WA0005-PhotoRoom.jpg",
        rating: 5,
        tags: ["cups", "tea", "dining", "kitchen", "set"]
    }
};

// User Behavior Tracking System
class UserBehaviorTracker {
    constructor() {
        this.userId = this.getUserId();
        this.initializeUserData();
    }

    getUserId() {
        let userId = localStorage.getItem('swiftbuy_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('swiftbuy_user_id', userId);
        }
        return userId;
    }

    initializeUserData() {
        const userData = {
            views: {},
            clicks: {},
            purchases: {},
            searches: [],
            categories: {},
            preferences: {},
            lastActivity: Date.now()
        };
        
        const existing = localStorage.getItem(`swiftbuy_user_${this.userId}`);
        if (!existing) {
            localStorage.setItem(`swiftbuy_user_${this.userId}`, JSON.stringify(userData));
        }
    }

    getUserData() {
        const data = localStorage.getItem(`swiftbuy_user_${this.userId}`);
        return data ? JSON.parse(data) : this.initializeUserData();
    }

    updateUserData(updates) {
        const data = this.getUserData();
        Object.assign(data, updates);
        data.lastActivity = Date.now();
        localStorage.setItem(`swiftbuy_user_${this.userId}`, JSON.stringify(data));
    }

    trackView(productName) {
        const data = this.getUserData();
        data.views[productName] = (data.views[productName] || 0) + 1;
        this.updateUserData(data);
    }

    trackClick(productName) {
        const data = this.getUserData();
        data.clicks[productName] = (data.clicks[productName] || 0) + 1;
        this.updateUserData(data);
    }

    trackPurchase(productName) {
        const data = this.getUserData();
        data.purchases[productName] = (data.purchases[productName] || 0) + 1;
        const product = PRODUCT_DATABASE[productName];
        if (product) {
            data.categories[product.category] = (data.categories[product.category] || 0) + 1;
        }
        this.updateUserData(data);
    }

    trackSearch(query) {
        const data = this.getUserData();
        data.searches.push({
            query: query.toLowerCase(),
            timestamp: Date.now()
        });
        // Keep only last 50 searches
        if (data.searches.length > 50) {
            data.searches = data.searches.slice(-50);
        }
        this.updateUserData(data);
    }

    getTopCategories(limit = 3) {
        const data = this.getUserData();
        const categories = Object.entries(data.categories)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([category]) => category);
        return categories;
    }

    getTopSearches(limit = 5) {
        const data = this.getUserData();
        const searchCounts = {};
        data.searches.forEach(search => {
            searchCounts[search.query] = (searchCounts[search.query] || 0) + 1;
        });
        return Object.entries(searchCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([query]) => query);
    }
}

// AI Recommendation Engine
class AIRecommendationEngine {
    constructor(tracker) {
        this.tracker = tracker;
    }

    // Calculate similarity score between products
    calculateSimilarity(product1, product2) {
        let score = 0;
        
        // Category match
        if (product1.category === product2.category) score += 3;
        if (product1.subcategory === product2.subcategory) score += 2;
        
        // Tag similarity
        const tags1 = new Set(product1.tags);
        const tags2 = new Set(product2.tags);
        const commonTags = [...tags1].filter(tag => tags2.has(tag));
        score += commonTags.length;
        
        // Price range similarity (within 30% price difference)
        const priceDiff = Math.abs(product1.price - product2.price) / Math.max(product1.price, product2.price);
        if (priceDiff < 0.3) score += 1;
        
        return score;
    }

    // Get recommendations based on user behavior
    getRecommendations(limit = 8) {
        const userData = this.tracker.getUserData();
        const recommendations = [];
        const productScores = {};

        // Score products based on user behavior
        Object.keys(PRODUCT_DATABASE).forEach(productName => {
            const product = PRODUCT_DATABASE[productName];
            let score = 0;

            // Views weight: 1 point per view
            score += (userData.views[productName] || 0) * 1;

            // Clicks weight: 3 points per click
            score += (userData.clicks[productName] || 0) * 3;

            // Purchases weight: 10 points per purchase
            score += (userData.purchases[productName] || 0) * 10;

            // Category preference
            if (userData.categories[product.category]) {
                score += userData.categories[product.category] * 2;
            }

            // Similarity to viewed/clicked products
            Object.keys(userData.views).concat(Object.keys(userData.clicks)).forEach(viewedProduct => {
                if (PRODUCT_DATABASE[viewedProduct]) {
                    const similarity = this.calculateSimilarity(product, PRODUCT_DATABASE[viewedProduct]);
                    score += similarity * 0.5;
                }
            });

            // Rating boost
            score += product.rating * 0.5;

            productScores[productName] = score;
        });

        // Sort by score and get top recommendations
        const sortedProducts = Object.entries(productScores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([name]) => PRODUCT_DATABASE[name]);

        return sortedProducts;
    }

    // Get trending products (based on all users' behavior)
    getTrendingProducts(limit = 4) {
        // For now, return highest rated products
        // In a real system, this would aggregate data from all users
        return Object.values(PRODUCT_DATABASE)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    // Get category-based recommendations
    getCategoryRecommendations(category, limit = 4) {
        return Object.values(PRODUCT_DATABASE)
            .filter(product => product.category === category)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }
}

// Predictive Search Engine
class PredictiveSearchEngine {
    constructor(tracker) {
        this.tracker = tracker;
    }

    // Get search suggestions based on query and user history
    getSuggestions(query, limit = 5) {
        const lowerQuery = query.toLowerCase();
        const suggestions = [];
        const userData = this.tracker.getUserData();

        // Search in product names and tags
        Object.values(PRODUCT_DATABASE).forEach(product => {
            const productName = product.name.toLowerCase();
            const tags = product.tags.map(t => t.toLowerCase());
            
            if (productName.includes(lowerQuery) || tags.some(tag => tag.includes(lowerQuery))) {
                suggestions.push({
                    text: product.name,
                    type: 'product',
                    category: product.category
                });
            }
        });

        // Add user's previous searches
        userData.searches.forEach(search => {
            if (search.query.includes(lowerQuery) && !suggestions.find(s => s.text === search.query)) {
                suggestions.push({
                    text: search.query,
                    type: 'search',
                    category: 'Recent Search'
                });
            }
        });

        // Remove duplicates and limit results
        const unique = [];
        const seen = new Set();
        for (const suggestion of suggestions) {
            if (!seen.has(suggestion.text) && unique.length < limit) {
                seen.add(suggestion.text);
                unique.push(suggestion);
            }
        }

        return unique;
    }

    // Get popular searches
    getPopularSearches(limit = 5) {
        const userData = this.tracker.getUserData();
        return this.tracker.getTopSearches(limit);
    }
}

// Initialize AI System
const behaviorTracker = new UserBehaviorTracker();
const recommendationEngine = new AIRecommendationEngine(behaviorTracker);
const searchEngine = new PredictiveSearchEngine(behaviorTracker);

// Export for use in other files
if (typeof window !== 'undefined') {
    window.AIRecommendations = {
        tracker: behaviorTracker,
        engine: recommendationEngine,
        searchEngine: searchEngine,
        PRODUCT_DATABASE: PRODUCT_DATABASE
    };
}

