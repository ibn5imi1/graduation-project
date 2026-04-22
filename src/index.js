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
    // Extracting data from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const pName = urlParams.get("name") || "بيتزا شهية";
    const pPrice = urlParams.get("price") || "0.00";
    const pImg = urlParams.get("img");

    const nameDisplay = document.getElementById("display-name");
    const breadcrumbDisplay = document.getElementById("breadcrumb-name");
    const priceDisplay = document.getElementById("display-price");
    const imageDisplay = document.getElementById("display-img");
    const container = document.getElementById("comments-container");

    if (nameDisplay) nameDisplay.innerText = pName;
    if (breadcrumbDisplay) breadcrumbDisplay.innerText = pName;
    if (priceDisplay) priceDisplay.innerText = "$" + pPrice;

    if (pImg && imageDisplay) {
        let folder = pImg.startsWith("product") ? "products" : "slide-images";
        imageDisplay.src = `assets/images/${folder}/${pImg}`;
    }

    // New Comment: Load all stored comments on startup
    loadComments();

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

        if (selectedRating === 0) {
            alert("يرجى اختيار تقييم بالنجوم أولاً!");
            return;
        }
        if (commentText.trim() === "") {
            alert("يرجى كتابة تعليق!");
            return;
        }

        // New Comment: Create a unique ID for each comment to handle deletion
        const commentData = {
            id: Date.now(), // Unique ID based on timestamp
            productName: pName,
            rating: selectedRating,
            text: commentText,
            timestamp: new Date().toLocaleString('ar-EG')
        };

        // New Comment: Save and then reload all comments to ensure UI consistency
        saveCommentToLocal(commentData);
        loadComments();

        // Reset fields
        commentInput.value = "";
        selectedRating = 0;
        updateStarsDisplay(0);
    };

    // New Comment: Save comment without overwriting the previous ones
    function saveCommentToLocal(comment) {
        const comments = JSON.parse(localStorage.getItem("pizza_comments") || "[]");
        comments.push(comment); // Append the new comment to the array
        localStorage.setItem("pizza_comments", JSON.stringify(comments));
    }

    // New Comment: Function to delete a specific comment by ID
    window.deleteComment = function (id) {
        let comments = JSON.parse(localStorage.getItem("pizza_comments") || "[]");
        // Filter out the comment that matches the ID
        comments = comments.filter(c => c.id !== id);
        localStorage.setItem("pizza_comments", JSON.stringify(comments));
        loadComments(); // Refresh the list
    };

    // New Comment: Completely refresh the comments UI
    function loadComments() {
        const comments = JSON.parse(localStorage.getItem("pizza_comments") || "[]");
        const filteredComments = comments.filter(c => c.productName === pName);

        // Clear container once before starting the loop
        container.innerHTML = "";

        if (filteredComments.length === 0) {
            container.innerHTML = '<div class="text-muted small">لا توجد تعليقات بعد، كن أول من يعلق!</div>';
            return;
        }

        // Render each comment from the filtered list
        filteredComments.forEach(c => renderComment(c));
    }

    // New Comment: UI Rendering for a single comment with a delete button on the same row as stars
    function renderComment(data) {
        let starHtml = "";
        for (let i = 1; i <= 5; i++) {
            starHtml += `<i class="fa-solid fa-star ${i <= data.rating ? "text-warning" : "text-secondary"}" style="font-size: 1.2rem;"></i>`;
        }

        const fullTimestamp = data.timestamp.split(' ');
        const datePart = fullTimestamp[0];
        const timePart = fullTimestamp.slice(1).join(' ');

        const newComment = `
            <div class="comment-card shadow-sm mb-4 p-3 bg-white rounded-3 border-start border-warning border-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 class="fw-bold mb-1" style="font-size: 1.1rem;">مستخدم جديد</h6>
                        <div class="text-muted" style="font-size: 0.85rem;">
                            <span>${datePart}</span> 
                            <span class="fw-bold ms-1" style="color: #555;">(${timePart})</span>
                        </div>
                    </div>
                    
                    <div class="d-flex align-items-center gap-3">
                        <div class="stars">${starHtml}</div>
                        <button onclick="deleteComment(${data.id})" class="btn btn-sm text-danger p-1" title="حذف">
                            <i class="fa-solid fa-trash-can fa-lg"></i>
                        </button>
                    </div>
                </div>
                <p class="mb-0 text-dark" style="font-size: 1.1rem; line-height: 1.6; border-top: 1px solid #f1f1f1; padding-top: 10px;">
                    ${data.text}
                </p>
            </div>`;

        container.insertAdjacentHTML("afterbegin", newComment);
    }
});