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


// use jquery To write a comment and rating, and to visit the pizza page
import $ from 'jquery';
window.jQuery = window.$ = $;

$(document).ready(function () {
    // 1. Extracting data from a URL
    const urlParams = new URLSearchParams(window.location.search);
    const pName = urlParams.get("name") || "بيتزا شهية";
    const pPrice = urlParams.get("price") || "0.00";
    const pImg = urlParams.get("img");

    // 2. Theme Logic
    $('body').removeClass();
    let themeClass = 'theme-default';

    if (pName.includes("مارجريتا") || pName.includes("الرانش")) themeClass = 'theme-margherita';
    else if (pName.includes("ببروني") || pName.includes("الفصول الاربعة")) themeClass = 'theme-pepperoni';
    else if (pName.includes("خضار") || pName.includes("أعشاب") || pName.includes("فطر")) themeClass = 'theme-veggie';
    else if (pName.includes("تشيز") || pName.includes("جبن")) themeClass = 'theme-cheese';
    else if (pName.includes("ثمار البحر") || pName.includes("الدجاج")) themeClass = 'theme-seafood';

    $('body').addClass(themeClass);

    // 3. User interface update
    $("#display-name, #breadcrumb-name").text(pName);
    $("#display-price").text("$" + pPrice);

    if (pImg) {
        let folder = pImg.includes("product") ? "products" : "slide-images";
        const fullPath = `../src/assets/images/${folder}/${pImg}`;
        const fallbackPath = `../assets/images/${folder}/${pImg}`;

        $("#display-img").attr("src", fullPath).on('error', function () {
            $(this).attr("src", fallbackPath);
        });
    }

    // 4. Star Rating Logic
    let selectedRating = 0;
    $("#star-input i").on("click", function () {
        selectedRating = $(this).data("value");
        updateStarsDisplay(selectedRating);
    });

    function updateStarsDisplay(rating) {
        $("#star-input i").each(function () {
            const val = $(this).data("value");
            $(this).toggleClass("active", val <= rating);
            $(this).css("color", val <= rating ? "#ffc107" : "#ccc");
        });
    }

    // 5. Comments Logic
    function loadComments() {
        const comments = JSON.parse(localStorage.getItem("pizza_comments") || "[]");
        const filteredComments = comments.filter(c => c.productName === pName);
        const $container = $("#comments-container");

        $container.empty();

        if (filteredComments.length === 0) {
            $container.append('<div class="text-muted small">لا توجد تعليقات بعد، كن أول من يعلق!</div>');
            return;
        }

        filteredComments.forEach(c => renderComment(c));
    }

    function renderComment(data) {
        let starHtml = "";
        for (let i = 1; i <= 5; i++) {
            starHtml += `<i class="fa-solid fa-star ${i <= data.rating ? "text-warning" : "text-secondary"}"></i>`;
        }

        const [datePart, ...timeParts] = data.timestamp.split(' ');
        const timePart = timeParts.join(' ');

        const commentHtml = `
            <div class="comment-card shadow-sm mb-4 p-3 bg-white rounded-3 border-start border-warning border-4" style="display:none;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 class="fw-bold mb-1">مستخدم جديد</h6>
                        <small class="text-muted">${datePart} <span class="fw-bold">(${timePart})</span></small>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <div class="stars">${starHtml}</div>
                        <button class="btn btn-sm text-danger delete-btn" data-id="${data.id}"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
                <p class="mb-0 pt-2 border-top">${data.text}</p>
            </div>`;

        const $newComment = $(commentHtml);
        $("#comments-container").prepend($newComment);
        $newComment.fadeIn(500);
    }

    $("#btn-post-comment").on("click", function () {
        const commentText = $("#user-comment").val();

        if (selectedRating === 0) return alert("يرجى اختيار تقييم!");
        if (!commentText.trim()) return alert("يرجى كتابة تعليق!");

        const commentData = {
            id: Date.now(),
            productName: pName,
            rating: selectedRating,
            text: commentText,
            timestamp: new Date().toLocaleString('ar-EG')
        };

        const comments = JSON.parse(localStorage.getItem("pizza_comments") || "[]");
        comments.push(commentData);
        localStorage.setItem("pizza_comments", JSON.stringify(comments));

        $("#user-comment").val("");
        selectedRating = 0;
        updateStarsDisplay(0);
        loadComments();
    });

    // Delete comment using Delegation
    $(document).on("click", ".delete-btn", function () {
        const id = $(this).data("id");
        let comments = JSON.parse(localStorage.getItem("pizza_comments") || "[]");
        comments = comments.filter(c => c.id !== id);
        localStorage.setItem("pizza_comments", JSON.stringify(comments));
        $(this).closest('.comment-card').fadeOut(400, loadComments);
    });

    // Initial loading operation
    loadComments();
});