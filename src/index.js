window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');

import "bootstrap/dist/js/bootstrap.bundle.js"
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../src/css/style.css";
import "../src/scss/style.scss";



document.addEventListener('DOMContentLoaded', () => {
    // 1. Select all "Order Now" and "+" buttons
    const orderButtons = document.querySelectorAll('.btn-grab, .btn-add-mini');

    orderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // 2. Retrieving product data from the DOM
            // We search for the nearest container for the product, whether it's in the offers or the menu.
            const card = button.closest('.offer-card') || button.closest('.menu-item-card');

            const productName = card.querySelector('h3, h5').innerText;
            const productPrice = card.querySelector('.new-price, .menu-item-price').innerText;

            // Clean the price from the dollar sign ($) and convert it to a number
            const cleanPrice = parseFloat(productPrice.replace(/[^\d.]/g, ''));

            // 3. Create the product object
            const product = {
                name: productName,
                price: cleanPrice,
                quantity: 1
            };

            addToStorage(product);
            showPopup(productName);
        });
    });
});

// Save function in LocalStorage
function addToStorage(product) {
    let cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];

    // Check if the product is already available to increase the quantity only
    const existingProductIndex = cart.findIndex(item => item.name === product.name);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('pizzaCart', JSON.stringify(cart));
}

// Function to display pop-up (Toast Notification)
function showPopup(name) {
    // Create a pop-up element
    const popup = document.createElement('div');
    popup.className = 'order-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <i class="fas fa-check-circle"></i>
            <span>تم إضافة <strong>${name}</strong> إلى طلبك بنجاح!</span>
        </div>
    `;

    document.body.appendChild(popup);

    // Hide pop-up after 3 seconds
    setTimeout(() => {
        popup.classList.add('show');
    }, 100);

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}

function displayOrders() {
    const cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];
    const container = document.getElementById('orders-container');

    if (cart.length === 0) {
        container.innerHTML = "<p>سلتك فارغة حالياً.</p>";
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name}</span>
            <span>العدد: ${item.quantity}</span>
            <span>السعر: ${item.price * item.quantity}$</span>
        </div>
    `).join('');
}

// Code to be placed only on the "Your Order" page
document.addEventListener('DOMContentLoaded', () => {
    displayCart();

    const confirmBtn = document.getElementById('confirm-order');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', sendOrder);
    }
});

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];
    const tableBody = document.getElementById('cart-table-body');
    const grandTotalElement = document.getElementById('grand-total');

    tableBody.innerHTML = '';
    let totalAll = 0;

    if (cart.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="py-4">سلتك فارغة، اذهب واطلب بعض البيتزا الشهية!</td></tr>';
        grandTotalElement.innerText = '0$';
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalAll += itemTotal;

        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td class="fw-bold">${item.name}</td>
                <td>${item.price}$</td>
                <td>
                    <span class="badge bg-secondary p-2">${item.quantity}</span>
                </td>
                <td class="fw-bold">${itemTotal}$</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    grandTotalElement.innerText = totalAll + '$';
}

// Function to delete one product
window.removeItem = (index) => {
    let cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('pizzaCart', JSON.stringify(cart));
    displayCart(); 
};

// Request Submission Function
function sendOrder() {
    const phone = document.getElementById('user-phone').value;
    const address = document.getElementById('user-address').value;
    const cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];

    if (cart.length === 0) {
        alert("سلتك فارغة!");
        return;
    }

    if (!phone || !address) {
        alert("يرجى إدخال رقم الهاتف والعنوان لإتمام الطلب.");
        return;
    }

    // Here you can send the data to the server. For now, we will only notify you of success and the emptying of the bin.
    alert(`شكراً لطلبك! سيتم التوصيل إلى: ${address}\nسنتواصل معك على الرقم: ${phone}`);

    localStorage.removeItem('pizzaCart');
    window.location.href = 'index.html'; // العودة للرئيسية
}

// Enable Bootstrap verification
(function () {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')

    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                } else {
                    event.preventDefault()
                    // Here you can add the code to send the actual message                    alert('تم استلام رسالتك بنجاح، سنرد عليك قريباً!')
                    form.reset()
                    form.classList.remove('was-validated')
                }
                form.classList.add('was-validated')
            }, false)
        })
})()


// 1. Extracting data from the URL (URL Parameters)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Extracting data from the URL (URL Parameters)
    const urlParams = new URLSearchParams(window.location.search);
    const pName = urlParams.get("name") || "بيتزا شهية";
    const pPrice = urlParams.get("price") || "0.00";
    const pImg = urlParams.get("img");

    const nameDisplay = document.getElementById("display-name");
    const breadcrumbDisplay = document.getElementById("breadcrumb-name");
    const priceDisplay = document.getElementById("display-price");
    const imageDisplay = document.getElementById("display-img");

    if (nameDisplay) nameDisplay.innerText = pName;
    if (breadcrumbDisplay) breadcrumbDisplay.innerText = pName;
    if (priceDisplay) priceDisplay.innerText = "$" + pPrice;

    // Image updated based on project paths
    if (pImg && imageDisplay) {
        let folder = pImg.startsWith("product") ? "products" : "slide-images";
        imageDisplay.src = `assets/images/${folder}/${pImg}`;
    }

    // 2. The logic of star ratings
    let selectedRating = 0;
    const stars = document.querySelectorAll("#star-input i");

    stars.forEach((star) => {
        star.addEventListener("click", () => {
            selectedRating = star.getAttribute("data-value");
            updateStarsDisplay(selectedRating);
        });
    });

    function updateStarsDisplay(rating) {
        stars.forEach((s) => {
            s.classList.toggle("active", s.getAttribute("data-value") <= rating);
        });
    }

    // 3. Comment posting function
    window.postComment = function () {
        const commentInput = document.getElementById("user-comment");
        const commentText = commentInput.value;
        const container = document.getElementById("comments-container");

        if (selectedRating === 0) {
            alert("يرجى اختيار تقييم بالنجوم أولاً!");
            return;
        }
        if (commentText.trim() === "") {
            alert("يرجى كتابة تعليق!");
            return;
        }

        // Delete the "No comments" message if found
        if (container.querySelector(".text-muted")) {
            container.innerHTML = "";
        }

        let starHtml = "";
        for (let i = 1; i <= 5; i++) {
            starHtml += `<i class="fa-solid fa-star ${i <= selectedRating ? "text-warning" : "text-secondary"}" style="font-size: 0.8rem;"></i>`;
        }

        const newComment = `
            <div class="comment-card shadow-sm mb-3 p-3 bg-white rounded-3 animate__animated animate__fadeIn">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="fw-bold mb-0">مستخدم جديد</h6>
                    <div class="stars">${starHtml}</div>
                </div>
                <p class="text-muted mb-0 small">${commentText}</p>
            </div>`;

        container.insertAdjacentHTML("afterbegin", newComment);

        // Reformatting fields
        commentInput.value = "";
        selectedRating = 0;
        updateStarsDisplay(0);
    };
});