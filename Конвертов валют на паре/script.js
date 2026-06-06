class Currency {
    constructor(code, amount = 0) {
        this.code = code;
        this.amount = Number(amount) || 0;
    }

    setAmount(value) {
        this.amount = Number(value) || 0;
    }
}

class Converter {
    constructor(fromCode, toCode) {
        this.fromCurrency = new Currency(fromCode);
        this.toCurrency = new Currency(toCode);
        this.rate = 1;
    }

    async loadRate() {
        try {
            if (this.fromCurrency.code === this.toCurrency.code) {
                this.rate = 1;
                return this.rate;
            }
            
            const url = `https://api.exchangerate-api.com/v4/latest/${this.fromCurrency.code}`;
            const response = await fetch(url);
            const data = await response.json();
            this.rate = data.rates[this.toCurrency.code];
            return this.rate;
        } catch (error) {
            const fallbackRates = {
                'USD_RUB': 88.45, 'RUB_USD': 0.0113,
                'EUR_RUB': 95.60, 'RUB_EUR': 0.01046,
                'USD_EUR': 0.925, 'EUR_USD': 1.081,
                'GBP_RUB': 112.30, 'RUB_GBP': 0.0089
            };
            const key = `${this.fromCurrency.code}_${this.toCurrency.code}`;
            this.rate = fallbackRates[key] || 73.67;
            return this.rate;
        }
    }

    convert(amount, fromCode) {
        const value = Number(amount) || 0;
        if (fromCode === this.fromCurrency.code) {
            return value * this.rate;
        }
        if (fromCode === this.toCurrency.code) {
            return value / this.rate;
        }
        return 0;
    }
}

const amountA = document.getElementById('amount-a');
const currencyA = document.getElementById('currency-a');
const amountB = document.getElementById('amount-b');
const currencyB = document.getElementById('currency-b');
const status = document.getElementById('status');

let converter = new Converter(currencyA.value, currencyB.value);
let isUpdating = false;

async function refreshConverter() {
    converter = new Converter(currencyA.value, currencyB.value);
    status.textContent = 'Загрузка курса...';
    await converter.loadRate();
    status.textContent = `Курс ${converter.fromCurrency.code} -> ${converter.toCurrency.code}: ${converter.rate.toFixed(4)}`;
}

async function syncValues(source) {
    if (isUpdating) return;
    isUpdating = true;

    await refreshConverter();

    const sourceValue = source === 'a' ? amountA.value : amountB.value;
    const sourceCode = source === 'a' ? currencyA.value : currencyB.value;
    const result = converter.convert(sourceValue, sourceCode);

    if (source === 'a') {
        amountB.value = result.toFixed(2);
    } else {
        amountA.value = result.toFixed(2);
    }

    isUpdating = false;
}

amountA.addEventListener('input', () => syncValues('a'));
amountB.addEventListener('input', () => syncValues('b'));

currencyA.addEventListener('change', () => {
    if (currencyA.value === currencyB.value) {
        currencyB.value = currencyA.value === 'USD' ? 'RUB' : 'USD';
    }
    syncValues('a');
});

currencyB.addEventListener('change', () => {
    if (currencyB.value === currencyA.value) {
        currencyA.value = currencyB.value === 'USD' ? 'RUB' : 'USD';
    }
    syncValues('a');
});

window.addEventListener('DOMContentLoaded', async () => {
    await syncValues('a');
});