
const products = [
    {
        id: 1,
        name: "Roti Kering",
        price: 10000,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=85"
    },
    {
        id: 2,
        name: "Roti Lilit",
        price: 15000,
        image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=500&q=85"
    },
    {
        id: 3,
        name: "Roti Selai",
        price: 10000,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=85"
    },
    {
        id: 4,
        name: "Roti Selai Original",
        price: 8000,
        image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=500&q=85"
    }
];

let cart = [];

function formatRupiah(number) {
    return "Rp " + number.toLocaleString("id-ID");
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();
}

function changeQuantity(productId, amount) {
    const item = cart.find(product => product.id === productId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== productId);
    }

    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems || !cartCount || !cartTotal) return;

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartCount.textContent = `(${totalQuantity})`;
    cartTotal.textContent = formatRupiah(totalPrice);

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Keranjang masih kosong.
                Silakan pilih roti favoritmu!
            </p>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img
                src="${item.image}"
                alt="${item.name}"
                class="cart-item-image"
            >

            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="cart-item-price">
                    ${formatRupiah(item.price * item.quantity)}
                </p>
            </div>

            <div class="quantity-control">
                <button
                    type="button"
                    onclick="changeQuantity(${item.id}, -1)"
                    aria-label="Kurangi jumlah ${item.name}"
                >−</button>

                <span>${item.quantity}</span>

                <button
                    type="button"
                    onclick="changeQuantity(${item.id}, 1)"
                    aria-label="Tambah jumlah ${item.name}"
                >+</button>
            </div>

            <button
                type="button"
                class="remove-button"
                onclick="removeFromCart(${item.id})"
                aria-label="Hapus ${item.name}"
                title="Hapus produk"
            >×</button>
        </div>
    `).join("");
}

function checkout() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong. Silakan pilih roti terlebih dahulu!");
        return;
    }

    const orderLines = cart.map(item =>
        `${item.name} x ${item.quantity} = ${formatRupiah(item.price * item.quantity)}`
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const message = [
        "RINGKASAN PESANAN BAKERY",
        "",
        ...orderLines,
        "",
        `Total: ${formatRupiah(total)}`,
        "",
        "Ini adalah ringkasan pesanan. Belum ada pembayaran atau pesanan yang dikirim."
    ].join("\n");

    alert(message);
}
