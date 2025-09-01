// Calculator state
let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetScreen = false;
let memory = 0;
let isLightTheme = false;

// DOM Elements
const resultElement = document.getElementById('result');
const historyElement = document.getElementById('history');
const themeToggle = document.getElementById('theme-toggle');

// Update display
function updateDisplay() {
    resultElement.textContent = currentInput;
    historyElement.textContent = previousInput + (operation || '');
}

// Append number
function appendNumber(number) {
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

// Append decimal point
function appendDecimal() {
    if (shouldResetScreen) {
        currentInput = '0.';
        shouldResetScreen = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// Append operator
function appendOperator(op) {
    calculate();
    previousInput = currentInput;
    operation = op;
    shouldResetScreen = true;
    updateDisplay();
}

// Calculate result
function calculate() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            computation = prev / current;
            break;
        default:
            return;
    }
    
    currentInput = roundResult(computation).toString();
    operation = null;
    previousInput = '';
    shouldResetScreen = true;
    updateDisplay();
}

// Round result to avoid floating point issues
function roundResult(num) {
    return Math.round(num * 1000000) / 1000000;
}

// Clear all
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetScreen = false;
    updateDisplay();
}

// Backspace
function backspace() {
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// Calculate percentage
function calculatePercentage() {
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay();
}

// Memory functions
function clearMemory() {
    memory = 0;
}

function recallMemory() {
    currentInput = memory.toString();
    updateDisplay();
}

function addToMemory() {
    memory += parseFloat(currentInput);
}

function subtractFromMemory() {
    memory -= parseFloat(currentInput);
}

// Toggle theme
function toggleTheme() {
    isLightTheme = !isLightTheme;
    document.body.classList.toggle('light-theme', isLightTheme);
    themeToggle.textContent = isLightTheme ? 'DARK MODE' : 'LIGHT MODE';
}

// Event delegation for button clicks
document.querySelector('.keypad').addEventListener('click', (event) => {
    const target = event.target;
    
    if (target.matches('button[data-number]')) {
        appendNumber(target.getAttribute('data-number'));
    } else if (target.matches('button[data-operator]')) {
        appendOperator(target.getAttribute('data-operator'));
    } else if (target.matches('button[data-action]')) {
        const action = target.getAttribute('data-action');
        
        switch (action) {
            case 'decimal':
                appendDecimal();
                break;
            case 'calculate':
                calculate();
                break;
            case 'clear-all':
                clearAll();
                break;
            case 'backspace':
                backspace();
                break;
            case 'percentage':
                calculatePercentage();
                break;
            case 'memory-clear':
                clearMemory();
                break;
            case 'memory-recall':
                recallMemory();
                break;
            case 'memory-add':
                addToMemory();
                break;
            case 'memory-subtract':
                subtractFromMemory();
                break;
        }
    }
});

// Keyboard support
document.addEventListener('keydown', function(event) {
    if (/[0-9]/.test(event.key)) {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendDecimal();
    } else if (event.key === '+' || event.key === '-') {
        appendOperator(event.key);
    } else if (event.key === '*') {
        appendOperator('*');
    } else if (event.key === '/') {
        event.preventDefault();
        appendOperator('/');
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculate();
    } else if (event.key === 'Escape') {
        clearAll();
    } else if (event.key === 'Backspace') {
        backspace();
    } else if (event.key === '%') {
        calculatePercentage();
    }
});

// Theme toggle event
themeToggle.addEventListener('click', toggleTheme);

// Initialize display
updateDisplay();