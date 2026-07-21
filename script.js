// Sample Products Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "electronics",
        price: 79.99,
        description: "High-quality sound with noise cancellation",
        emoji: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "electronics",
        price: 199.99,
        description: "Track your fitness and stay connected",
        emoji: "⌚"
    },
    {
        id: 3,
        name: "USB-C Cable",
        category: "electronics",
        price: 12.99,
        description: "Fast charging and data transfer",
        emoji: "🔌"
    },
    {
        id: 4,
        name: "T-Shirt",
        category: "clothing",
        price: 24.99,
        description: "Comfortable 100% cotton t-shirt",
        emoji: "👕"
    },
    {
        id: 5,
        name: "Jeans",
        category: "clothing",
        price: 59.99,
        description: "Classic blue denim jeans",
        emoji: "👖"
    },
    {
        id: 6,
        name: "Sneakers",
        category: "clothing",
        price: 89.99,
        description: "Comfortable athletic shoes",
        emoji: "👟"
    },
    {
        id: 7,
        name: "JavaScript Guide",
        category: "books",
        price: 34.99,
        description: "Learn JavaScript from basics to advanced",
        emoji: "📚"
    },
    {
        id: 8,
        name: "Web Development",
        category: "books",
        price: 44.99,
        description: "Complete guide to modern web development",
        emoji: "📖"
    },
    {
        id: 9,
        name: "Design Patterns",
        category: "books",
        price: 49.99,
        description: "Master design patterns for better code",
        emoji: "🎨"
    },
    {
        id: 10,
        name: "Laptop Stand",
        category: "electronics",
        price: 39.99,
        description: "Ergonomic aluminum laptop stand",
        emoji: "💻"
    },
    {
        id: 11,
        name: "Sweater",
        category: "clothing",
        price: 54.99,
        description: "Cozy winter sweater",
        emoji: "🧶"
    },
    {
        id: 12,
        name: "Python Handbook",
        category: "books",
        price: 39.99,
        description: "Essential Python programming guide",
        emoji: "🐍"
    }
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartCount();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            filterProducts();
        });
    });

    // Cart icon
    document.getElementById('cartIcon').addEventListener('click', openCart);

    // Close cart
    document.getElementById('closeCart').addEventListener('click', closeCart);

    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', checkout);

    // Contact form
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('cartModal');
        if (e.target === modal) {
            closeCart();
        }
    });
}

// Render Products
function renderProducts(productsToRender) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-content">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <div class="product-price">$${product.price}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filter Products
function filterProducts() {
    if (currentFilter === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === currentFilter);
        renderProducts(filtered);
    }
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCart();
        }
    }
}

// Save Cart to Local Storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Render Cart Items
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.textContent = '0.00';
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
    }).join('');

    cartTotal.textContent = total.toFixed(2);
}

// Open Cart Modal
function openCart() {
    renderCart();
    document.getElementById('cartModal').style.display = 'block';
}

// Close Cart Modal
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your purchase!\n\nTotal: $${total.toFixed(2)}\n\nYour order has been confirmed.`);
    
    cart = [];
    saveCart();
    updateCartCount();
    closeCart();
}

// Handle Contact Form Submission
function handleContactSubmit(e) {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    document.getElementById('contactForm').reset();
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #22c55e;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);