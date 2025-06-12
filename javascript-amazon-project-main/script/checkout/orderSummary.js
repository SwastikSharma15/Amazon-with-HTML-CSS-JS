import { cart, removeFromCart,calculateCartQuantity,updateQuantity, updateDeliveryOption } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
let cartSummaryHTML = '';

cart.forEach((cartItem) => { 
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);
    
    if (!matchingProduct) {
        return;
    }

    const deliveryOptionId = cartItem.deliveryOptionId;

    // let deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId);

    // if (!deliveryOption) {
    //     console.warn(`No delivery option found for ID: ${deliveryOptionId}`);
    //     return; // Skip rendering this cart item if delivery option is invalid
    // }

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'day');

    const dateString = deliveryDate.format('dddd, MMMM D');

cartSummaryHTML += `
  <div class="cart-item-container 
      js-cart-item-container
      js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: ${dateString}
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          ${matchingProduct.getPrice()}
        </div>
        <div class="product-quantity js-product-quantity js-product-quantity-${matchingProduct.id}">
          <span>
            Quantity: <span class="js-product-quantity-value js-product-quantity-${matchingProduct.id}">${cartItem.quantity}</span>
          </span>

          <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
            Update
          </span>
          <input class="quantity-input js-quantity-input-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
          <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
          <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryOptionsHTML(matchingProduct, cartItem)}
      </div>
    </div>
  </div>
`;


});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, 'day');
  const dateString = deliveryDate.format('dddd, MMMM D');
  const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)}`;

  const isChecked = String(deliveryOption.id) === String(cartItem.deliveryOptionId);

    html += `
    <label class="delivery-option js-delivery-option" 
         data-product-id="${matchingProduct.id}" 
         data-delivery-option-id="${deliveryOption.id}">
         
    <input type="radio"
           ${isChecked ? 'checked' : ''}
           class="delivery-option-input"
           name="delivery-option-${matchingProduct.id}">

    <div class="delivery-option-text">
      <div class="delivery-option-date">
        ${dateString}
      </div>
      <div class="delivery-option-price">
        ${priceString} Shipping
      </div>
    </div>
    
  </label>
`;


})
  return html;
};

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

updateCartQuantity();

document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        
        container.remove();
        updateCartQuantity();
        renderPaymentSummary();
        
    });
});


function updateCartQuantity() {
  calculateCartQuantity();
  const cartQuantity = calculateCartQuantity();
  document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
}
updateCartQuantity();

document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    
    const container = document.querySelector(`.js-cart-item-container${productId}`);
    container.classList.add('is-editing-quantity');
  });
});

// Function to save quantity (reusable for both Save button and Enter key)
function saveQuantity(productId) {
  const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
  const newQuantity = Number(quantityInput.value);
  
  if(newQuantity < 1 || newQuantity >= 100) {
    alert('Please enter a quantity between 1 and 100.');
    return;
  }

  updateQuantity(productId, newQuantity);

  const container = document.querySelector(`.js-cart-item-container${productId}`);
  container.classList.remove('is-editing-quantity');

  const quantityLabel = document.querySelector(`.js-quantity-label${productId}`);
  quantityLabel.innerHTML = newQuantity;
  updateCartQuantity();
}

// Save button event listeners
document.querySelectorAll('.js-save-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    saveQuantity(productId);
  });
});

// Enter key event listeners for quantity inputs
document.querySelectorAll('.quantity-input').forEach((input) => {
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const productId = input.dataset.productId;
      saveQuantity(productId);
    }
  });
});

document.querySelectorAll('.js-delivery-option').forEach((element) => {
  element.addEventListener('click', (event) => {
    // const productId = element.dataset.productId;
    // const deliveryOptionId = element.dataset.deliveryOptionId;

    //shortened version

    const {productId, deliveryOptionId} = element.dataset;

    updateDeliveryOption(productId, deliveryOptionId);
    renderOrderSummary();
    renderPaymentSummary();
  });
});

}
