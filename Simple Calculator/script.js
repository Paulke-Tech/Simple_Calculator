document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    const themeToggle = document.getElementById('theme-toggle');
    
    let currentInput = '';
    let previousInput = '';
    let operation = null;
    let resetScreen = false;

    // Theme toggle functionality
    themeToggle.addEventListener('click', toggleTheme);

    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = 'Light Mode';
        } else {
            themeToggle.textContent = 'Dark Mode';
        }
    }

    // Button click handlers
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            handleButtonClick(value);
        });
    });

    // Keyboard support
    document.addEventListener('keydown', handleKeyPress);

    function handleButtonClick(value) {
        if (!isNaN(value) || value === '.') {
            appendNumber(value);
        } else {
            handleOperation(value);
        }
        updateDisplay();
    }

    function handleKeyPress(e) {
        e.preventDefault();
        
        const key = e.key;
        
        // Numbers
        if (/[0-9\.]/.test(key)) {
            appendNumber(key);
        } 
        // Operations
        else if (['+', '-', '*', '/', '%'].includes(key)) {
            handleOperation(key);
        }
        // Enter or space for equals
        else if (key === 'Enter' || key === ' ') {
            handleOperation('=');
        }
        // Escape for clear
        else if (key === 'Escape') {
            handleOperation('C');
        }
        // Backspace for CE
        else if (key === 'Backspace') {
            handleOperation('CE');
        }
        
        updateDisplay();
    }

    function appendNumber(number) {
        if (display.value === '0' || resetScreen) {
            currentInput = number;
            resetScreen = false;
        } else {
            if (number === '.' && currentInput.includes('.')) return;
            currentInput += number;
        }
    }

    function handleOperation(op) {
        switch(op) {
            case 'C':
                currentInput = '0';
                previousInput = '';
                operation = null;
                break;
            case 'CE':
                currentInput = currentInput.length > 1 
                    ? currentInput.slice(0, -1) 
                    : '0';
                break;
            case '%':
                if (currentInput !== '0') {
                    currentInput = (parseFloat(currentInput) / 100).toString();
                }
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                if (previousInput === '') {
                    previousInput = currentInput;
                    currentInput = '0';
                }
                operation = op;
                resetScreen = true;
                break;
            case '=':
                if (operation === null) return;
                compute();
                operation = null;
                break;
            default:
                return;
        }
    }

    function compute() {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch(operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            default:
                return;
        }
        
        currentInput = result.toString();
        previousInput = '';
        resetScreen = true;
    }

    function updateDisplay() {
        display.value = currentInput === '' ? '0' : currentInput;
    }
});

