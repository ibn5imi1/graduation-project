window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');

import "bootstrap/dist/js/bootstrap.bundle.js"
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../src/css/style.css";
import "../src/scss/style.scss";



document.addEventListener('DOMContentLoaded', () => {
    // 1. تحديد جميع أزرار "اطلب الآن" و "+"
    const orderButtons = document.querySelectorAll('.btn-grab, .btn-add-mini');

    orderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // 2. الحصول على بيانات المنتج من الـ DOM
            // نبحث عن أقرب حاوية للمنتج سواء كان في العروض أو المنيو
            const card = button.closest('.offer-card') || button.closest('.menu-item-card');

            const productName = card.querySelector('h3, h5').innerText;
            const productPrice = card.querySelector('.new-price, .menu-item-price').innerText;

            // تنظيف السعر من علامة $ وتحويله لرقم
            const cleanPrice = parseFloat(productPrice.replace(/[^\d.]/g, ''));

            // 3. إنشاء كائن المنتج
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

// وظيفة الحفظ في LocalStorage
function addToStorage(product) {
    let cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];

    // التأكد إذا كان المنتج موجود مسبقاً لزيادة العدد فقط
    const existingProductIndex = cart.findIndex(item => item.name === product.name);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('pizzaCart', JSON.stringify(cart));
}

// وظيفة إظهار البوب أب (Toast Notification)
function showPopup(name) {
   // إنشاء عنصر البوب أب 
    const popup = document.createElement('div');
    popup.className = 'order-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <i class="fas fa-check-circle"></i>
            <span>تم إضافة <strong>${name}</strong> إلى طلبك بنجاح!</span>
        </div>
    `;

    document.body.appendChild(popup);

    // إخفاء البوب أب بعد 3 ثوانٍ
    setTimeout(() => {
        popup.classList.add('show');
    }, 100);

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}

// كود يوضع في صفحة "طلبك" فقط
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

// وظيفة حذف منتج واحد
window.removeItem = (index) => {
    let cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('pizzaCart', JSON.stringify(cart));
    displayCart(); // إعادة العرض بعد الحذف
};

// وظيفة إرسال الطلب
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

    // هنا يمكنك إرسال البيانات للسيرفر، سنكتفي حالياً بتنبيه نجاح وتنظيف السلة
    alert(`شكراً لطلبك! سيتم التوصيل إلى: ${address}\nسنتواصل معك على الرقم: ${phone}`);

    localStorage.removeItem('pizzaCart');
    window.location.href = 'index.html'; // العودة للرئيسية
}


// تفعيل التحقق من Bootstrap
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
                    // هنا يمكنك إضافة كود إرسال الرسالة الحقيقي
                    alert('تم استلام رسالتك بنجاح، سنرد عليك قريباً!')
                    form.reset()
                    form.classList.remove('was-validated')
                }
                form.classList.add('was-validated')
            }, false)
        })
})()

// اضافة تعليق و تقييم
document.addEventListener('DOMContentLoaded', () => {
    // 1. استخراج البيانات من الرابط (URL Parameters)
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

    // تحديث الصورة بناءً على مسارات المشروع
    if (pImg && imageDisplay) {
        let folder = pImg.startsWith("product") ? "products" : "slide-images";
        imageDisplay.src = `assets/images/${folder}/${pImg}`;
    }

    // 2. منطق تقييم النجوم
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

    // 3. وظيفة نشر التعليق
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

        // حذف رسالة "لا توجد تعليقات" إذا وجدت
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

        // إعادة تهيئة الحقول
        commentInput.value = "";
        selectedRating = 0;
        updateStarsDisplay(0);
    };
});