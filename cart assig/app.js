// Product List
// This array contains the list of products available in the shop.
// Each product has an id, name, price in Pakistani Rupees, and an image path.
const products = [
  {
    id: 1,
    name: "Berries Pestry",
    price: 1200,
    image: "assets/beries pestry.jpg"
  },
  {
    id: 2,
    name: "Chocolate Pestry",
    price: 1000,
    image: "assets/brown pestry.jpg"
  },
  {
    id: 3,
    name: "Chees Pestry",
    price: 800,
    image: "assets/chees mint pestry.jpg"
  },
  {
    id: 4,
    name: "Berries Cake",
    price: 2000,
    image: "assets/berries cake.jpg"
  }
];

// Load & Save Cart
// Get cart data from localStorage. If no cart exists, return an empty array.
function loadCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save the updated cart back to localStorage.
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart Count Icon
// This updates the cart icon (usually in the navbar) to show total quantity.
function updateCartCount() {
  const cart = loadCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0); // Total items
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) cartCountEl.textContent = count;
}
// Add Item to Cart
// When "Add to Cart" is clicked, this adds the product by ID.
// If it already exists in the cart, it increases the quantity.
function addToCart(productId) {
  const cart = loadCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    // Item already in cart — increase quantity
    existing.quantity += 1;
  } else {
    // Item not in cart — find product and add new entry
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push({ id: product.id, quantity: 1 });
    }
  }

  saveCart(cart);     
     // Save updated cart
  updateCartCount();   
    // Refresh cart icon count
}
// Update Quantity (+ / -)
// Handles increasing or decreasing quantity from the cart page.
// If quantity becomes 0, it removes the item from the cart.
function updateQuantity(productId, delta) {
  const cart = loadCart();
  const index = cart.findIndex(item => item.id === productId);

  if (index !== -1) {
    cart[index].quantity += delta;

    // If quantity is now zero or less, remove item
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    saveCart(cart);  
         // Save updated cart
    renderCart(); 
   // Refresh cart items on screen
    updateCartCount();  
      // Refresh cart count in icon
  }
}

// Render Cart Page
// Builds and displays the full cart page with all added items,
// including image, name, price, quantity controls, and totals.
function renderCart() {
  const cart = loadCart();
  const container = document.getElementById('cart-container');
  const summary = document.getElementById('summary');

  if (!container || !summary) return; 
  // Exit if not on cart.html

  if (cart.length === 0) {
    // If cart is empty, show message and clear summary
    container.innerHTML = "<p>Your cart is empty.</p>";
    summary.innerHTML = "";
    return;
  }

  // Build HTML for each item in the cart
  container.innerHTML = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div class="cart-details">
          <h3>${product.name}</h3>
          <p>Price: Rs. ${product.price}</p>
          <div class="qty-controls">
            <button onclick="updateQuantity(${product.id}, -1)">−</button>
            <span>${cartItem.quantity}</span>
            <button onclick="updateQuantity(${product.id}, 1)">+</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Calculate total quantity and total price
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product.price * item.quantity);
  }, 0);

  // Display summary totals below the cart
  summary.innerHTML = `
    <p><strong>Total Quantity:</strong> ${totalQty}</p>
    <p><strong>Total Price:</strong> Rs. ${totalPrice}</p>
  `;
}
// Render Product Cards (Shop Page)

// Generates and displays product cards on the shop page.
// Each card includes image, name, and "Add to Cart" button.
function renderProductsPage() {
  const container = document.getElementById('product-container');
  if (!container) return; 
  // Not on index.html, so exit

  // Build HTML for each product
  container.innerHTML = products.map(p => `
    <div class="card">
      <div class="card-img">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="card-details">
        <h3>${p.name}</h3>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');

  updateCartCount();
   // Show cart item count
}



// Page Load Handler
// Automatically runs when the page finishes loading.
// Decides what to render based on which page is open.
document.addEventListener('DOMContentLoaded', () => {
  renderProductsPage();
   // Runs only if product container is on the page (shop)
  renderCart();      
     // Runs only if cart container is on the page (cart)
});






