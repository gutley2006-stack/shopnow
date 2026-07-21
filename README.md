# ShopHub - Shopping Website

A fully functional e-commerce shopping website built with HTML, CSS, and vanilla JavaScript.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Product Catalog**: Browse products with filtering by category
- **Shopping Cart**: Add/remove items and manage quantities
- **Local Storage**: Cart persists even after closing the browser
- **Product Categories**: Electronics, Clothing, and Books
- **Product Filters**: Filter products by category
- **Smooth Animations**: Hover effects and smooth transitions
- **Contact Form**: Customer support contact form
- **Notifications**: Real-time notifications when items are added to cart

## Project Structure

```
shopping-website/
├── index.html      # Main HTML file with structure
├── styles.css      # Styling and responsive design
├── script.js       # JavaScript functionality
└── README.md       # Project documentation
```

## Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. No server setup required - runs entirely in the browser!

## How to Use

### Browsing Products
- Scroll through the featured products section
- Use filter buttons to browse by category (All, Electronics, Clothing, Books)

### Shopping
- Click the "Add" button on any product to add it to your cart
- The cart count will update in the navigation bar

### Cart Management
- Click the shopping cart icon (🛒) to open the cart
- Adjust quantities using the +/- buttons
- Remove items with the "Remove" button
- Click "Proceed to Checkout" to complete your purchase

### Product Categories
- **Electronics**: Headphones, smartwatches, cables, and more
- **Clothing**: T-shirts, jeans, sneakers, and accessories
- **Books**: Programming guides and web development books

## Features Explained

### Product Data
Products are stored in a JavaScript array with the following properties:
- `id`: Unique product identifier
- `name`: Product name
- `category`: Product category
- `price`: Product price
- `description`: Brief product description
- `emoji`: Visual representation

### Shopping Cart
- Stores items with quantities
- Uses browser's Local Storage to persist cart data
- Automatically calculates totals
- Supports quantity adjustments

### Responsive Design
The website includes responsive breakpoints for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## Customization

### Adding New Products
Edit the `products` array in `script.js`:

```javascript
{
    id: 13,
    name: "Your Product",
    category: "your-category",
    price: 99.99,
    description: "Product description",
    emoji: "🎯"
}
```

### Changing Colors
Modify CSS custom properties in `styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --text-color: #333;
    --light-bg: #f8fafc;
    --border-color: #e2e8f0;
}
```

### Adding New Categories
1. Add products with the new category name
2. Add a new filter button in the HTML
3. The JavaScript will automatically handle filtering

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- User authentication and accounts
- Payment gateway integration
- Product reviews and ratings
- Wishlist functionality
- Order history
- Admin dashboard for managing products
- Search functionality
- Advanced product filtering (price range, ratings, etc.)

## License

This project is free to use for personal and educational purposes.

## Support

For questions or suggestions, please fill out the contact form on the website or create an issue in the repository.

---

Enjoy your shopping! 🛍️