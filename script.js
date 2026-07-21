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

// Checkout Data
let checkoutData = {
    contact: {},
    shipping: {},
    payment: {}
};

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
    document.getElementById('checkoutBtn').addEventListener('click', openCheckout);

    // Close checkout
    document.getElementById('closeCheckout').addEventListener('click', closeCheckout);

    // Contact form
    document.getElementById('contactPageForm').addEventListener('submit', handleContactSubmit);

    // Payment method change
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.payment-details').forEach(el => el.style.display = 'none');
            const selected = e.target.value;
            if (selected === 'credit') {
                document.getElementById('cardPayment').style.display = 'block';
            } else if (selected === 'paypal') {
                document.getElementById('paypalPayment').style.display = 'block';
            } else if (selected === 'applepay') {
                document.getElementById('applepayPayment').style.display = 'block';
            }
        });
    });

    // Shipping method change
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', updateOrderTotal);
    });

    // Card number formatting
    document.getElementById('cardNumber').addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = formattedValue;
    });

    // Expiry date formatting
    document.getElementById('expiry').addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const checkoutModal = document.getElementById('checkoutModal');
        const successModal = document.getElementById('successModal');
        if (e.target === checkoutModal) closeCheckout();
        if (e.target === successModal) closeSuccess();
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

// Open/Close Cart
function openCart() {
    if (cart.length === 0) {
        showNotification('Your cart is empty! Add items to continue.', 'warning');
        return;
    }
    renderCart();
    document.getElementById('cartModal').classList.add('show');
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('show');
}

// Checkout Functions
function openCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty! Add items to continue.', 'warning');
        return;
    }
    closeCart();
    document.getElementById('checkoutModal').classList.add('show');
    updateOrderTotal();
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('show');
}

// Navigation between steps
function nextStep(currentStep) {
    if (currentStep === 1) {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!firstName || !lastName || !email || !phone) {
            showNotification('Please fill in all contact information', 'warning');
            return;
        }

        checkoutData.contact = { firstName, lastName, email, phone };
        goToStep(2);
    } else if (currentStep === 2) {
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const zip = document.getElementById('zip').value.trim();
        const country = document.getElementById('country').value.trim();
        const shipping = document.querySelector('input[name="shipping"]:checked').value;

        if (!address || !city || !state || !zip || !country) {
            showNotification('Please fill in all shipping address fields', 'warning');
            return;
        }

        checkoutData.shipping = {
            address,
            address2: document.getElementById('address2').value.trim(),
            city,
            state,
            zip,
            country,
            shippingMethod: shipping
        };

        renderOrderSummary();
        goToStep(3);
    }
}

function prevStep(currentStep) {
    goToStep(currentStep - 1);
}

function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.progress-step').forEach(s => s.classList.remove('active'));

    // Show current step
    document.getElementById('step' + step).classList.add('active');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');

    // Update completed steps
    for (let i = 1; i < step; i++) {
        document.querySelector(`.progress-step[data-step="${i}"]`).classList.add('completed');
    }
}

function renderOrderSummary() {
    const summaryDiv = document.getElementById('orderSummary');
    let html = '';

    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        html += `
            <div class="summary-item">
                <span>${item.name} <span class="summary-item-qty">x${item.quantity}</span></span>
                <span>$${itemTotal}</span>
            </div>
        `;
    });

    summaryDiv.innerHTML = html;
    updateOrderTotal();
}

function updateOrderTotal() {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Get shipping cost
    const shippingMethod = document.querySelector('input[name="shipping"]:checked').value;
    let shippingCost = 0;
    if (shippingMethod === 'express') shippingCost = 9.99;
    else if (shippingMethod === 'overnight') shippingCost = 19.99;

    const tax = (subtotal * 0.1);
    const total = subtotal + shippingCost + tax;

    document.getElementById('subtotalAmount').textContent = subtotal.toFixed(2);
    document.getElementById('shippingAmount').textContent = shippingCost.toFixed(2);
    document.getElementById('taxAmount').textContent = tax.toFixed(2);
    document.getElementById('finalTotal').textContent = total.toFixed(2);
}

function completePayment() {
    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    const terms = document.getElementById('terms').checked;

    if (!terms) {
        showNotification('Please accept the terms and conditions', 'warning');
        return;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    if (paymentMethod === 'credit') {
        if (!cardName || cardNumber.length !== 16 || !expiry || cvv.length < 3) {
            showNotification('Please enter valid card information', 'warning');
            return;
        }
    }

    // Process payment
    processPayment();
}

function processPayment() {
    // Simulate payment processing
    showNotification('Processing payment...', 'success');

    setTimeout(() => {
        // Generate order number
        const orderNumber = 'ORD-' + Date.now();

        // Show success modal
        document.getElementById('checkoutModal').classList.remove('show');
        document.getElementById('successModal').classList.add('show');
        document.getElementById('orderNumber').textContent = `Order Number: ${orderNumber}`;

        // Save order to localStorage
        const order = {
            orderNumber,
            contact: checkoutData.contact,
            shipping: checkoutData.shipping,
            items: cart,
            total: document.getElementById('finalTotal').textContent,
            date: new Date().toISOString()
        };

        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
        checkoutData = { contact: {}, shipping: {}, payment: {} };
    }, 2000);
}

function closeSuccess() {
    document.getElementById('successModal').classList.remove('show');
    goToStep(1);
    // Reset checkout form
    document.getElementById('contactForm').reset();
    document.getElementById('shippingForm').reset();
    document.getElementById('paymentForm').reset();
}

// Contact Form Handler
function handleContactSubmit(e) {
    e.preventDefault();
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    document.getElementById('contactPageForm').reset();
}

// Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: ${type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animation styles
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