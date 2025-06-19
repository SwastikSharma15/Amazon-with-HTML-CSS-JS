import { renderOrderSummary } from "../../script/checkout/orderSummary.js";
import { loadFromStorage, cart } from '../../data/cart.js';
import { loadProducts, loadProductsFetch } from "../../data/products.js";

describe('Test sweet: renderOrderSummary', () => {

        const productId1= 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
        const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

    beforeAll((done)=> {
        loadProductsFetch().then(() => {
            done();
        })
    });

    beforeEach(() => { 
        spyOn(localStorage, 'setItem');

        document.querySelector('.js-test-container').innerHTML = `<div class="js-order-summary"></div>
        <div class="js-cart-quantity"></div>
        <div class="js-payment-summary"></div>
        <a class="js-return-to-home-link"></a>`;


        spyOn(localStorage, 'getItem').and.callFake(() => {
                    return JSON.stringify([{
                        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                        quantity: 2,
                        deliveryOptionId: '1'
                    }, {
                        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                        quantity: 1,
                        deliveryOptionId: '2'
                    }]);
                });
        loadFromStorage();

        renderOrderSummary();
    });

    it('displays the cart',() => {

        

        expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
        expect(
        document.querySelector(`.js-product-quantity-${productId1}`).innerText).toContain('Quantity: 2');

        expect(
        document.querySelector(`.js-product-quantity-${productId2}`).innerText).toContain('Quantity: 1');

        document.querySelector('.js-test-container').innerHTML = ``;
        
    });

    it('removes a product', () => {

        document.querySelector(`.js-delete-link[data-product-id="${productId1}"]`).click();
        
        expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(1);
        
        expect(document.querySelector(`.js-cart-item-container-${productId1}`)).toEqual(null);

        expect(document.querySelector(`.js-cart-item-container-${productId2}`)).not.toEqual(null);

        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual(productId2);

        document.querySelector('.js-test-container').innerHTML = ``;
    });
}); 