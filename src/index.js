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