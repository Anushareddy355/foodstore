document.addEventListener('DOMContentLoaded', function() {
    const cartTable = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const paymentButton = document.getElementById('payment-button');
    const paymentDetails = document.getElementById('payment-details');
    const paymentItems = document.getElementById('payment-items');
    const payNowButton = document.getElementById('pay-now-button');
    const orderHistory = document.getElementById('order-history');
    const orderHistoryItems = document.getElementById('order-history-items');
    const backToCartButton = document.getElementById('back-to-cart');

    function updateCart() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartTable.innerHTML = ''; // Clear the table

        let totalPrice = 0;

        cartItems.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${item.img}" alt="${item.name}" style="width: 50px;"></td>
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>
                    <button class="decrease-quantity" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-index="${index}">+</button>
                </td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                <td><button class="remove-item" data-index="${index}">Remove</button></td>
            `;
            cartTable.appendChild(row);

            totalPrice += item.price * item.quantity;
        });

        totalPriceElement.textContent = `₹${totalPrice.toFixed(2)}`;

        // Add event listeners for quantity controls and remove buttons
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', handleDecreaseQuantity);
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', handleIncreaseQuantity);
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', handleRemoveItem);
        });
    }

    function handleDecreaseQuantity(event) {
        const index = event.target.getAttribute('data-index');
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        if (cartItems[index].quantity > 1) {
            cartItems[index].quantity--;
        } else {
            cartItems.splice(index, 1); // Remove item if quantity is 1
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
    }

    function handleIncreaseQuantity(event) {
        const index = event.target.getAttribute('data-index');
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        cartItems[index].quantity++;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
    }

    function handleRemoveItem(event) {
        const index = event.target.getAttribute('data-index');
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        cartItems.splice(index, 1); // Remove item from cart
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
    }

    function displayPaymentDetails() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        paymentItems.innerHTML = ''; // Clear existing payment items

        let totalPayment = 0;

        cartItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>${item.quantity}</td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
            `;
            paymentItems.appendChild(row);
            totalPayment += item.price * item.quantity;
        });

        paymentDetails.style.display = 'block'; // Show the payment details section
        totalPriceElement.textContent = `₹${totalPayment.toFixed(2)}`;
    }

    function displayOrderHistory() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        orderHistoryItems.innerHTML = ''; // Clear existing order history

        let orderId = new Date().getTime(); // Unique order ID
        let date = new Date().toLocaleDateString();
        cartItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${orderId}</td>
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>${item.quantity}</td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                <td>${date}</td>
            `;
            orderHistoryItems.appendChild(row);
        });

        orderHistory.style.display = 'block'; // Show the order history section
        paymentDetails.style.display = 'none'; // Hide payment details
    }

    paymentButton.addEventListener('click', displayPaymentDetails);

    payNowButton.addEventListener('click', function() {
        displayOrderHistory();
        localStorage.removeItem('cartItems'); // Clear cart items after payment
    });

    backToCartButton.addEventListener('click', function() {
        orderHistory.style.display = 'none'; // Hide order history
        updateCart(); // Re-display cart items
    });

    updateCart(); // Initial cart update
});
