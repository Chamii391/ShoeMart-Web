// -------------------------------
//  Get Cart
// -------------------------------
export function getCart() {
    let cart = localStorage.getItem("cart");
    if (!cart) {
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        return cart;
    }
    return JSON.parse(cart);
}

// -------------------------------
//  Add to Cart
// -------------------------------
export function addToCart(product, selectedSize, qty) {
    let cart = getCart();

    if (!selectedSize) {
        throw new Error("Size not selected");
    }

    // Find if same product + same size already in cart
    const index = cart.findIndex(item =>
        item.product_id === product.product_id &&
        item.size_value === selectedSize.size_value
    );

    if (index === -1) {
        // Add NEW item
        cart.push({
            product_id: product.product_id,
            name: product.name,
            size_value: selectedSize.size_value,
            qty: qty,
            price: product.price,
            image: product.images?.[0] || null,
            total: product.price * qty
        });
    } else {
        // Update quantity for same size
        const newQty = cart[index].qty + qty;

        if (newQty > selectedSize.stock) {
            throw new Error("Cannot add more than available stock");
        }

        cart[index].qty = newQty;
        cart[index].total = cart[index].price * newQty;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

// -------------------------------
//  Remove Item from Cart
// -------------------------------
export function removeFromCart(product_id, size_value) {
    let cart = getCart();

    cart = cart.filter(
        item =>
            !(item.product_id === product_id && item.size_value === size_value)
    );

    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

// -------------------------------
//  Update Quantity (increase/decrease)
// -------------------------------
export function updateCartQty(product_id, size_value, qty, maxStock) {
    let cart = getCart();

    const index = cart.findIndex(
        item =>
            item.product_id === product_id &&
            item.size_value === size_value
    );

    if (index === -1) return cart;

    if (qty < 1) qty = 1;
    if (qty > maxStock) qty = maxStock;

    cart[index].qty = qty;
    cart[index].total = cart[index].price * qty;

    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

// -------------------------------
//  Get Total Amount
// -------------------------------
export function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.total, 0);
}

// -------------------------------
//  Clear Cart
// -------------------------------
export function clearCart() {
    localStorage.setItem("cart", JSON.stringify([]));
}
