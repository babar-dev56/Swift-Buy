// Brand Sales Notification Admin Helper
// Use this to create brand sale notifications

// Example: Create a brand sale notification
// Usage: createBrandSale('Nike', 30, 48) - 30% off, expires in 48 hours

function createBrandSale(brandName, discountPercent, hoursUntilExpiry = 48) {
    if (window.notificationSystem) {
        const expiryTime = hoursUntilExpiry * 60 * 60 * 1000; // Convert hours to milliseconds
        window.notificationSystem.createBrandSaleNotification(
            brandName, 
            discountPercent, 
            hoursUntilExpiry
        );
        console.log(`✅ Brand sale notification created for ${brandName} - ${discountPercent}% off`);
    } else {
        console.error('Notification system not loaded');
    }
}

// Example notifications - you can call these or create your own
function createSampleBrandSales() {
    // Nike Sale - 30% off, expires in 48 hours
    createBrandSale('Nike', 30, 48);
    
    // Apple Sale - 15% off, expires in 72 hours
    createBrandSale('Apple', 15, 72);
    
    // Samsung Sale - 25% off, expires in 24 hours
    createBrandSale('Samsung', 25, 24);
    
    // Adidas Sale - 20% off, expires in 36 hours
    createBrandSale('Adidas', 20, 36);
}

// Auto-create notifications on page load (optional - remove if you want manual control)
// Uncomment the line below to enable auto-notifications
// document.addEventListener('DOMContentLoaded', createSampleBrandSales);

// Export for use in console or other scripts
window.createBrandSale = createBrandSale;
window.createSampleBrandSales = createSampleBrandSales;

