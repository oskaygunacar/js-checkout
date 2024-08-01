const checkoutList = document.querySelector('#checkoutItems');
const emptyCheckout = document.querySelector('#emptyCheckout');
const fullCheckout = document.querySelector('.fullCheckOut');

export function addToCart(e){
    if (e.target.tagName !== 'BUTTON') return;

    const btn = e.target

    emptyCheckout.style.display = 'none';
    fullCheckout.style.display = 'block';


    let product = getProductDetails(e);
    AddOrderToCheckout(product, btn);
}

function getProductDetails(e){
    const productDescription = e.target.parentElement.querySelector('.productDescription')
    let product = {
        productName : productDescription.children[1].textContent,
        productPrice : parseFloat(productDescription.children[2].textContent.split('$')[1]),
        orderCount : 1
    }
    
    return product;
}

export function AddOrderToCheckout(product, btn){
    let checkoutItem = 
    `
    <li class="checkoutItem" checkout-number="">
        <div class="checkoutSub">
            <p class="itemName">${product.productName}</p>
            <div class="checkoutDescription">
                <span class="itemCount">${product.orderCount}</span> 
                <small>@$${product.productPrice}</small> 
                <span class="itemPrice">$${product.orderCount * product.productPrice}</span>
            </div>
        </div>
        <button class="checkoutClsBtn" id="checkoutClsBtn"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg></button>
    </li>
    `

    checkoutList.insertAdjacentHTML('beforeend', checkoutItem);
    openOrderCount(btn,product);
    UpdateTotal();
    document.querySelectorAll('button.checkoutClsBtn').forEach(btn => {
        btn.addEventListener('click', e => RemoveOrderFromCheckout(e, product));
    });
}


// Dinleyici işlevlerini saklamak için global referanslar
let incrementHandler;
let decrementHandler;

function openOrderCount(btn, product) {
    btn.style.display = 'none';
    let orderCountBtn = btn.nextElementSibling;

    orderCountBtn.style.display = 'flex';

    let incrementBtn = orderCountBtn.querySelector('.increment');
    let decrementBtn = orderCountBtn.querySelector('.decrement');

    // Dinleyicilerin tekrar eklenmesini engellemek için önce kaldır
    if (incrementHandler) {
        incrementBtn.removeEventListener('click', incrementHandler);
    }
    if (decrementHandler) {
        decrementBtn.removeEventListener('click', decrementHandler);
    }

    // Dinleyici işlevlerini tanımla
    incrementHandler = (e) => incrementOrderCount(e, orderCountBtn, product);
    decrementHandler = (e) => decrementOrderCount(e, orderCountBtn, product);

    // Dinleyicileri ekle
    incrementBtn.addEventListener('click', incrementHandler);
    decrementBtn.addEventListener('click', decrementHandler);
}

function incrementOrderCount(e, orderCountBtn, product) {
    let orderCount = orderCountBtn.querySelector('span.orderCount');
    let itemCount = parseInt(orderCount.textContent);
    itemCount += 1;
    orderCount.textContent = itemCount;
    product.orderCount = itemCount;
    increaseCheckoutOrderCount(product);
}

function decrementOrderCount(e, orderCountBtn, product) {
    let orderCount = orderCountBtn.querySelector('span.orderCount');
    let itemCount = parseInt(orderCount.textContent);
    if (itemCount > 1) {
        itemCount--;
        orderCount.textContent = itemCount;
        product.orderCount = itemCount;
        decreaseCheckoutOrderCount(product);
    } else {
        orderCountBtn.style.display = 'none';
        let addToCartBtn = orderCountBtn.parentElement.querySelector('.addToCartBtn');
        clearCheckoutOrder(product);
        addToCartBtn.style.display = 'flex';
    }
}

function increaseCheckoutOrderCount(product){
    let productName = product.productName;
    let checkoutItems = document.querySelectorAll('.checkoutItem');
    if (checkoutItems.length > 0) {
        checkoutItems.forEach(item => {
            if (item.querySelector('.itemName').textContent === productName) {
                let itemCount = item.querySelector('.itemCount');
                let itemPrice = item.querySelector('.itemPrice');
                let count = parseInt(itemCount.textContent);
                count += 1;
                itemCount.textContent = count;
                itemPrice.textContent = `$${count * product.productPrice}`;
                UpdateTotal();
            }
        });
    }
}

function decreaseCheckoutOrderCount(product){
    let productName = product.productName;
    let checkoutItems = document.querySelectorAll('.checkoutItem');
    if (checkoutItems.length > 0) {
        checkoutItems.forEach(item => {
            if (item.querySelector('.itemName').textContent === productName) {
                let itemCount = item.querySelector('.itemCount');
                let itemPrice = item.querySelector('.itemPrice');
                let count = parseInt(itemCount.textContent);
                count -= 1;
                itemCount.textContent = count;
                itemPrice.textContent = `$${count * product.productPrice}`;
                UpdateTotal();
            }
        });
    }
}

function clearCheckoutOrder(product){
    let productName = product.productName;
    let checkoutItems = document.querySelectorAll('.checkoutItem');
    if (checkoutItems.length > 0) {
        checkoutItems.forEach(item => {
            if (item.querySelector('.itemName').textContent === productName) {
                item.remove();
            }
        });
        UpdateTotal();
    }
}

function UpdateTotal(){
    let total = 0;
    let itemPrices = document.querySelectorAll('.itemPrice');
    itemPrices.forEach(itemPrice => {
        total += parseFloat(itemPrice.textContent.split('$')[1]);
    });
    document.querySelector('.totalPrice').textContent = `$${total}`;
    document.querySelector('#checkoutTitle').textContent = `Your Cart (${document.querySelectorAll('.checkoutItem').length})`;
}


function RemoveOrderFromCheckout(e, product){
    if (e.target.tagName !== 'BUTTON') return;

    console.log('remove order button clicked !');

    const btn = e.target;
    let checkoutItemToRemove = btn.parentElement;
/*     let productName = checkoutItemToRemove.querySelector('.itemName').textContent;
    let productPrice = parseFloat(checkoutItem.querySelector('.itemPrice').textContent.split('$')[1]);
    let productCount = parseInt(checkoutItem.querySelector('.itemCount').textContent); */

    checkoutItemToRemove.remove();
    UpdateTotal();
    updateProduct(product);
}

function updateProduct(product) {
    let allProductDescriptions = document.querySelectorAll('.productDescription')
    allProductDescriptions.forEach(productDescription => {
        if (productDescription.children[1].textContent == product.productName) {
            console.log('if worked !');
            let addToCartBtn = productDescription.parentElement.querySelector('.addToCartBtn');
            let orderCountBtn = productDescription.parentElement.querySelector('#itemCounter');
            let orderCount = orderCountBtn.querySelector('.orderCount');
            product.orderCount = 1;
            orderCount.textContent = product.orderCount;
            orderCountBtn.style.display = 'none';
            addToCartBtn.style.display = 'flex';
        }
    });
}