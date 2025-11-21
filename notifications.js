// Notifications System for Brand Sales
class NotificationSystem {
    constructor() {
        this.notifications = this.loadNotifications();
        this.initializeNotificationCenter();
    }

    // Load notifications from localStorage
    loadNotifications() {
        const stored = localStorage.getItem('swiftbuy_notifications');
        return stored ? JSON.parse(stored) : [];
    }

    // Save notifications to localStorage
    saveNotifications() {
        localStorage.setItem('swiftbuy_notifications', JSON.stringify(this.notifications));
    }

    // Create a new notification
    createNotification(title, message, type = 'sale', brand = '', link = '', expiry = null) {
        const notification = {
            id: Date.now() + Math.random(),
            title: title,
            message: message,
            type: type, // 'sale', 'new', 'reminder', etc.
            brand: brand,
            link: link,
            read: false,
            timestamp: Date.now(),
            expiry: expiry || (Date.now() + 7 * 24 * 60 * 60 * 1000) // Default 7 days
        };

        this.notifications.unshift(notification);
        this.saveNotifications();
        this.updateNotificationBadge();
        this.showToastNotification(notification);
        return notification;
    }

    // Mark notification as read
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationBadge();
        }
    }

    // Mark all as read
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateNotificationBadge();
    }

    // Delete notification
    deleteNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
        this.updateNotificationBadge();
    }

    // Get unread count
    getUnreadCount() {
        return this.notifications.filter(n => !n.read && n.expiry > Date.now()).length;
    }

    // Get active notifications (not expired)
    getActiveNotifications() {
        return this.notifications.filter(n => n.expiry > Date.now());
    }

    // Show toast notification
    showToastNotification(notification) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${this.getNotificationIcon(notification.type)}</div>
                <div class="toast-text">
                    <div class="toast-title">${notification.title}</div>
                    <div class="toast-message">${notification.message}</div>
                </div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            'sale': '🔥',
            'new': '🆕',
            'reminder': '⏰',
            'brand': '🏷️',
            'general': '📢'
        };
        return icons[type] || icons.general;
    }

    // Update notification badge
    updateNotificationBadge() {
        const badge = document.getElementById('notificationBadge');
        const count = this.getUnreadCount();
        
        if (badge) {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    // Initialize notification center
    initializeNotificationCenter() {
        // Create notification center HTML if it doesn't exist
        if (!document.getElementById('notificationCenter')) {
            const center = document.createElement('div');
            center.id = 'notificationCenter';
            center.className = 'notification-center';
            center.innerHTML = `
                <div class="notification-header">
                    <h3>Notifications</h3>
                    <button class="mark-all-read" onclick="window.notificationSystem.markAllAsRead(); renderNotifications();">Mark all as read</button>
                </div>
                <div class="notification-list" id="notificationList"></div>
            `;
            document.body.appendChild(center);
        }

        // Update badge on load
        this.updateNotificationBadge();
    }

    // Render notifications in center
    renderNotifications() {
        const list = document.getElementById('notificationList');
        if (!list) return;

        const activeNotifications = this.getActiveNotifications();
        
        if (activeNotifications.length === 0) {
            list.innerHTML = `
                <div class="no-notifications">
                    <div class="no-notifications-icon">🔔</div>
                    <p>No notifications yet</p>
                    <p class="subtext">We'll notify you when brands have sales!</p>
                </div>
            `;
            return;
        }

        list.innerHTML = activeNotifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" onclick="handleNotificationClick('${notification.id}', '${notification.link}')">
                <div class="notification-icon">${this.getNotificationIcon(notification.type)}</div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${this.getTimeAgo(notification.timestamp)}</div>
                </div>
                <div class="notification-actions">
                    ${!notification.read ? '<span class="unread-dot"></span>' : ''}
                    <button class="delete-notification" onclick="event.stopPropagation(); window.notificationSystem.deleteNotification('${notification.id}'); renderNotifications();">×</button>
                </div>
            </div>
        `).join('');
    }

    // Get time ago string
    getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return new Date(timestamp).toLocaleDateString();
    }

    // Create brand sale notification
    createBrandSaleNotification(brandName, discount, duration = null) {
        const message = duration 
            ? `Get up to ${discount}% off on ${brandName} products! Sale ends ${duration}.`
            : `Get up to ${discount}% off on ${brandName} products! Limited time offer.`;
        
        return this.createNotification(
            `🔥 ${brandName} Sale!`,
            message,
            'sale',
            brandName,
            `brands.html?brand=${encodeURIComponent(brandName)}`,
            duration ? Date.now() + (duration * 60 * 60 * 1000) : null
        );
    }
}

// Initialize notification system
const notificationSystem = new NotificationSystem();
window.notificationSystem = notificationSystem;

// Handle notification click
function handleNotificationClick(notificationId, link) {
    notificationSystem.markAsRead(notificationId);
    renderNotifications();
    
    if (link) {
        window.location.href = link;
    }
}

// Render notifications
function renderNotifications() {
    if (window.notificationSystem) {
        window.notificationSystem.renderNotifications();
    }
}

// Toggle notification center
function toggleNotificationCenter() {
    const center = document.getElementById('notificationCenter');
    if (center) {
        center.classList.toggle('active');
        if (center.classList.contains('active')) {
            renderNotifications();
        }
    }
}

// Close notification center when clicking outside
document.addEventListener('click', function(e) {
    const center = document.getElementById('notificationCenter');
    const bell = document.getElementById('notificationBell');
    
    if (center && bell && !center.contains(e.target) && !bell.contains(e.target)) {
        center.classList.remove('active');
    }
});

// Sample brand sale notifications (you can add more programmatically)
document.addEventListener('DOMContentLoaded', function() {
    // Check if we should create sample notifications (only once)
    if (!localStorage.getItem('notifications_initialized')) {
        // Create some sample brand sale notifications
        setTimeout(() => {
            notificationSystem.createBrandSaleNotification('Nike', 30, 48);
            notificationSystem.createBrandSaleNotification('Apple', 15, 72);
            notificationSystem.createBrandSaleNotification('Samsung', 25, 24);
        }, 2000);
        
        localStorage.setItem('notifications_initialized', 'true');
    }
    
    // Update badge
    notificationSystem.updateNotificationBadge();
});

