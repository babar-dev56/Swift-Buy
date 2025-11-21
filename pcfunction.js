// Function to Add Item to Cart
function addToCart(productName, productPrice) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex((item) => item.name === productName);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Track with AI system
    if (window.AIRecommendations && window.AIRecommendations.tracker) {
        window.AIRecommendations.tracker.trackClick(productName);
    }
    
    alert(`${productName} has been added to the cart!`);
    renderCart(); // Update cart display
}

// Function to Render Cart Items
function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');
    let subtotal = 0;

    if (cartItemsContainer && cartSummaryContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Start adding items to your cart to see them here!</p>
                    <a href="products.html" class="shop-btn">Continue Shopping</a>
                </div>
            `;
            cartSummaryContainer.innerHTML = '';
            return;
        }

        cartItemsContainer.innerHTML = '';
        
        // Get product images from AI database if available
        const getProductImage = (productName) => {
            if (window.AIRecommendations && window.AIRecommendations.PRODUCT_DATABASE) {
                const product = window.AIRecommendations.PRODUCT_DATABASE[productName];
                return product ? product.image : 'https://via.placeholder.com/120x120?text=Product';
            }
            return 'https://via.placeholder.com/120x120?text=Product';
        };

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            const productImage = getProductImage(item.name);

            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${productImage}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/120x120?text=Product'">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="price">Rs. ${item.price.toLocaleString()}</p>
                        <div class="quantity">
                            <label>Quantity: </label>
                            <input type="number" value="${item.quantity}" min="1" 
                                onchange="updateQuantity(${index}, this.value)">
                        </div>
                    </div>
                    <div class="item-total">
                        <p class="total-price">Rs. ${itemTotal.toLocaleString()}</p>
                        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                    </div>
                </div>`;
        });

        const shippingFee = 200;
        const totalPrice = subtotal + shippingFee;

        cartSummaryContainer.innerHTML = `
            <h3>Cart Summary</h3>
            <div class="summary-item">
                <span>Subtotal:</span>
                <span class="summary-price">Rs. ${subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-item">
                <span>Shipping:</span>
                <span class="summary-price">Rs. ${shippingFee.toLocaleString()}</span>
            </div>
            <div class="summary-item">
                <span>Total:</span>
                <span class="summary-price">Rs. ${totalPrice.toLocaleString()}</span>
            </div>
            <a href="checkout.html">
                <button class="checkout-btn">Proceed to Checkout →</button>
            </a>
        `;

        // Save subtotal to localStorage for Checkout page
        localStorage.setItem("subtotal", subtotal);
    }
}

// Function to Update Quantity
function updateQuantity(index, quantity) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (quantity < 1) {
        alert("Quantity cannot be less than 1");
        return;
    }

    cart[index].quantity = parseInt(quantity);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart(); // Re-render cart
}

// Function to Remove Item from Cart
function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart(); // Re-render cart
}

// Function to Render Checkout Summary
function renderCheckoutSummary() {
    const subtotal = parseFloat(localStorage.getItem("subtotal")) || 0;
    const shippingFee = 200;
    const totalPrice = subtotal + shippingFee;

    // Display Subtotal, Shipping Fee, and Total Price
    const subtotalElement = document.getElementById("subtotal");
    const shippingElement = document.getElementById("shipping");
    const totalElement = document.getElementById("total");

    if (subtotalElement && shippingElement && totalElement) {
        subtotalElement.textContent = `Rs. ${subtotal}`;
        shippingElement.textContent = `Rs. ${shippingFee}`;
        totalElement.textContent = `Rs. ${totalPrice}`;
    }
}

// Track purchase when order is completed
function trackPurchase() {
    if (window.AIRecommendations && window.AIRecommendations.tracker) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.forEach(item => {
            // Track purchase for each item based on quantity
            for (let i = 0; i < item.quantity; i++) {
                window.AIRecommendations.tracker.trackPurchase(item.name);
            }
        });
    }
}

// Event Listener to Initialize Cart or Checkout Page
document.addEventListener("DOMContentLoaded", () => {
    // Load AI system if available
    if (typeof window.AIRecommendations === 'undefined') {
        const script = document.createElement('script');
        script.src = 'ai-recommendations.js';
        document.head.appendChild(script);
    }
    
    if (document.getElementById('cart-items')) {
        renderCart(); // Render Cart Page
    }

    if (document.getElementById('subtotal')) {
        renderCheckoutSummary(); // Render Checkout Page
    }
    
    // Track product views on products page
    if (window.location.pathname.includes('products.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productName = urlParams.get('product');
        if (productName && window.AIRecommendations && window.AIRecommendations.tracker) {
            window.AIRecommendations.tracker.trackView(decodeURIComponent(productName));
        }
    }
});
