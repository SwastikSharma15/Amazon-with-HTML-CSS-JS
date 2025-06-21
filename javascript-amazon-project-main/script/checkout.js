import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
//import '../data/cart-class.js';
// import '../data/car.js';
// import '../data/backend-practice.js';
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";

async function loadPage(){

    try {

        // throw 'error1';

        await loadProductsFetch();

        const value = await new Promise((resolve) => {
            // throw 'error2';

            loadCart(() => {
                // reject('error3'); // This is provided by promise 
                
                resolve('value3');
            });
        })

    } catch (error) {
    console.error("Error loading products or cart");
    }

    renderOrderSummary();
    renderPaymentSummary();

}
loadPage();


/* Promise.all([
    loadProductsFetch(),
    
    new Promise((resolve) => {
        loadCart(() => {
            resolve('value-cart');
        });
    })

]).then((values) => {
    // console.log(values);
    renderOrderSummary();
    renderPaymentSummary();
}); */


/* new Promise((resolve) => {
    loadProducts(() => {
        resolve('value1');
    });

}).then((value) => {
    console.log(value);
    return new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    });

}).then(() => {
    renderOrderSummary();
    renderPaymentSummary();
}); */

/* loadProducts(() => {
    renderOrderSummary();
    renderPaymentSummary();
}); */
