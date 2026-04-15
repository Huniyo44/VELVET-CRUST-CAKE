// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

function updateCartCount() {
    document.getElementById('cart-link').textContent = `Cart (${cartCount})`;
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price: parseFloat(price), quantity: 1 });
    }
    cartCount++;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} added to cart!`);
}

function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    cartCount--;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <span>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</span>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Modal functionality
const modal = document.getElementById('cart-modal');
const cartLink = document.getElementById('cart-link');
const closeBtn = document.querySelector('.close');
const orderBtn = document.getElementById('order-btn');
const orderForm = document.getElementById('order-form');
const deliveryForm = document.getElementById('delivery-form');

cartLink.onclick = function() {
    renderCart();
    modal.style.display = 'block';
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
    orderForm.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        orderForm.style.display = 'none';
    }
}

orderBtn.onclick = function() {
    orderForm.style.display = 'block';
}

deliveryForm.onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const instructions = document.getElementById('instructions').value;
    
    let orderSummary = `Order for ${name}\nPhone: ${phone}\nAddress: ${address}\n`;
    if (instructions) orderSummary += `Instructions: ${instructions}\n`;
    orderSummary += 'Items:\n';
    cart.forEach(item => {
        orderSummary += `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    orderSummary += `Total: $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`;
    
    alert('Order placed!\n\n' + orderSummary);
    // In a real app, send to server
    cart = [];
    cartCount = 0;
    localStorage.removeItem('cart');
    updateCartCount();
    modal.style.display = 'none';
    orderForm.style.display = 'none';
}

// Add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.onclick = function() {
        const name = this.getAttribute('data-name');
        const price = this.getAttribute('data-price');
        addToCart(name, price);
    }
});

// Initialize
updateCartCount();