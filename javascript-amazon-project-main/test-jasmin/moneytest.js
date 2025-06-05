import { formatCurrency } from "../script/utils/money.js";

describe('Testing formatCurrency function', () => {
    it('convert cents to dollars', () => { 
        expect(formatCurrency(1000)).toEqual("10.00");
    });
    
    it('Testing with 0 cents', () => {
        expect(formatCurrency(0)).toEqual("0.00");
    });

    it('Testing with roundups', () => {
        expect(formatCurrency(2000.5)).toEqual("20.01");
    });
});