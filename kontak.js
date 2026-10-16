
/* ==========================================
   BAKERY — JAVASCRIPT HALAMAN KONTAK
========================================== */

const BAKERY_WHATSAPP = "6281234567890";

/* ==========================================
   1. DATA DAN ELEMEN HALAMAN
========================================== */

const contactForm = document.getElementById("contact-form");
const orderSummary = document.getElementById("order-summary");
const orderItems = document.getElementById("order-items");
const orderTotal = document.getElementById("order-total");
const messageInput = document.getElementById("message");
const whatsappLink = document.getElementById("contact-whatsapp");

/* ==========================================
   2. FUNGSI FORMAT RUPIAH
========================================== */

function formatRupiah(number) {
  return "Rp " + Number(number).toLocaleString("id-ID");
}

/* ==========================================
   3. AMBIL PESANAN DARI HALAMAN MENU
========================================== */

function getSavedOrder() {
  try {
    const savedCart = localStorage.getItem("bakeryCart");

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart
      .filter(item =>
        item &&
        typeof item.name === "string" &&
        Number(item.price) >= 0 &&
        Number(item.quantity) > 0
      )
      .map(item => ({
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity)
      }));
  } catch (error) {
    console.error("Gagal membaca keranjang:", error);
    return [];
  }
}

/* ==========================================
   4. TAMPILKAN RINGKASAN PESANAN
========================================== */

function renderOrderSummary() {
  const cart = getSavedOrder();

  orderItems.replaceChildren();

  if (cart.length === 0) {
    orderSummary.hidden = true;
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const row = document.createElement("div");
    row.className = "order-item";

    const name = document.createElement("span");
    name.className = "order-item-name";
    name.textContent =
      `${item.name} × ${item.quantity}`;

    const price = document.createElement("span");
    price.className = "order-item-price";
    price.textContent = formatRupiah(subtotal);

    row.append(name, price);
    orderItems.appendChild(row);
  });

  orderTotal.textContent = formatRupiah(total);
  orderSummary.hidden = false;

  // Tambahkan detail pesanan ke kolom pesan
  // hanya jika kolom pesan masih kosong.
  if (!messageInput.value.trim()) {
    messageInput.value =
      "Halo Bakery, saya ingin memesan:\n" +
      cart.map(item =>
        `- ${item.name} (${item.quantity} buah)`
      ).join("\n") +
      `\nTotal sementara: ${formatRupiah(total)}` +
      "\n\nNama penerima:" +
      "\nAlamat pengantaran atau keterangan pengambilan:" +
      "\nCatatan tambahan:";
  }
}

/* ==========================================
   5. SIAPKAN TAUTAN WHATSAPP TOKO
========================================== */

function setupWhatsAppLink() {
  if (!whatsappLink) return;

  // Nomor contoh belum diganti, jadi tautan
  // tidak diaktifkan agar tidak salah menghubungi orang.
  if (
    !BAKERY_WHATSAPP ||
    BAKERY_WHATSAPP === "6281234567890"
  ) {
    whatsappLink.href = "#";
    whatsappLink.removeAttribute("target");

    whatsappLink.addEventListener("click", function(event) {
      event.preventDefault();

      alert(
        "Nomor WhatsApp toko belum diatur. " +
        "Silakan ganti BAKERY_WHATSAPP di file js/kontak.js."
      );
    });

    return;
  }

  whatsappLink.href =
    "https://wa.me/" + BAKERY_WHATSAPP;

  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
}

/* ==========================================
   6. VALIDASI NOMOR WHATSAPP
========================================== */

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, "");

  // Validasi sederhana nomor telepon Indonesia.
  return digits.length >= 9 && digits.length <= 15;
}

/* ==========================================
   7. PROSES FORMULIR
========================================== */

function handleContactSubmit(event) {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    return;
  }

  if (
    !BAKERY_WHATSAPP ||
    BAKERY_WHATSAPP === "6281234567890"
  ) {
    alert(
      "Nomor WhatsApp toko belum diatur. " +
      "Ganti nomor BAKERY_WHATSAPP terlebih dahulu."
    );
    return;
  }

  const firstName =
    document.getElementById("firstName").value.trim();

  const lastName =
    document.getElementById("lastName").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const phone =
    document.getElementById("phone").value.trim();

  const message = messageInput.value.trim();

  if (!isValidPhone(phone)) {
    alert("Periksa kembali nomor telepon atau WhatsApp kamu.");
    document.getElementById("phone").focus();
    return;
  }

  const fullName =
    `${firstName} ${lastName}`.trim();

  const cart = getSavedOrder();

  let total = 0;

  const orderLines = cart.map(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    return (
      `- ${item.name}\n` +
      `  Jumlah: ${item.quantity}\n` +
      `  Harga: ${formatRupiah(subtotal)}`
    );
  });

  let whatsappMessage =
    "Halo Bakery! Saya ingin menghubungi toko.\n\n" +
    `Nama: ${fullName}\n` +
    `Email: ${email}\n` +
    `Nomor WhatsApp: ${phone}\n\n`;

  if (cart.length > 0) {
    whatsappMessage +=
      "RINGKASAN PESANAN\n" +
      orderLines.join("\n") +
      "\n\n" +
      `TOTAL SEMENTARA: ${formatRupiah(total)}\n\n`;
  }

  whatsappMessage +=
    "Pesan dan catatan:\n" +
    message +
    "\n\nMohon konfirmasi ketersediaan dan total akhirnya. Terima kasih.";

  const whatsappURL =
    "https://wa.me/" +
    BAKERY_WHATSAPP +
    "?text=" +
    encodeURIComponent(whatsappMessage);

  
  const newWindow = window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );

  if (!newWindow) {
    alert(
      "Browser mungkin memblokir jendela WhatsApp. " +
      "Izinkan pop-up untuk situs ini, lalu coba lagi."
    );
  }
}

/* ==========================================
   8. JALANKAN SAAT HALAMAN DIBUKA
========================================== */

document.addEventListener("DOMContentLoaded", function() {
  renderOrderSummary();
  setupWhatsAppLink();

  if (contactForm) {
    contactForm.addEventListener(
      "submit",
      handleContactSubmit
    );
  }
});
