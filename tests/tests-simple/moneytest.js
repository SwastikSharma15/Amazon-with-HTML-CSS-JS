import { formatCurrency } from "../../script/utils/money.js";

console.log("Testing formatCurrency function...");

console.log("convert cents to dollars");

if (formatCurrency(1000) === "10.00") {
    console.log("passed");
} else {
    console.error("failed");
}

console.log("Testing with 0 cents:");

if (formatCurrency(0) === "0.00") {
    console.log("passed");
} else {
    console.error("failed");
}

console.log("Testing with roundups:");

if (formatCurrency(2000.5) === "20.01") {
    console.log("passed");
} else {
    console.error("failed");
}