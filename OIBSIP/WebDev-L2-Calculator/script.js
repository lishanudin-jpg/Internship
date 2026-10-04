// =========================================
// GET HTML ELEMENTS
// =========================================

const display = document.getElementById("display");
const previousDisplay = document.getElementById("previousDisplay");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");

const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const equalsButton = document.querySelector('[data-action="equals"]');


// =========================================
// CALCULATOR VARIABLES
// =========================================

let currentInput = "0";

let previousInput = null;

let currentOperator = null;

let waitingForOperand = false;

let justCalculated = false;


// =========================================
// UPDATE DISPLAY
// =========================================

function updateDisplay() {

    display.textContent = currentInput;

    if (
        previousInput !== null &&
        currentOperator !== null
    ) {
        previousDisplay.textContent =
            `${formatNumber(previousInput)} ${getOperatorSymbol(currentOperator)}`;
    } else {
        previousDisplay.textContent = "";
    }
}


// =========================================
// ADD NUMBER
// =========================================

function inputNumber(number) {

    // Start fresh after calculation
    if (justCalculated) {

        currentInput = "0";

        previousInput = null;

        currentOperator = null;

        waitingForOperand = false;

        justCalculated = false;
    }


    // If waiting for a new operand
    if (waitingForOperand) {

        currentInput = number;

        waitingForOperand = false;

        updateDisplay();

        return;
    }


    // Prevent multiple leading zeros
    if (currentInput === "0") {

        currentInput = number;
    }

    else {

        currentInput += number;
    }


    updateDisplay();
}


// =========================================
// ADD DECIMAL
// =========================================

function inputDecimal() {

    // Start fresh after calculation
    if (justCalculated) {

        currentInput = "0";

        previousInput = null;

        currentOperator = null;

        waitingForOperand = false;

        justCalculated = false;
    }


    // Start a new decimal number
    if (waitingForOperand) {

        currentInput = "0.";

        waitingForOperand = false;

        updateDisplay();

        return;
    }


    // Don't allow two decimal points
    if (!currentInput.includes(".")) {

        currentInput += ".";
    }


    updateDisplay();
}


// =========================================
// SELECT OPERATOR
// =========================================

function selectOperator(operator) {

    const inputValue = parseFloat(currentInput);


    // If invalid number
    if (Number.isNaN(inputValue)) {

        return;
    }


    // If user changes operator before entering number
    if (
        previousInput !== null &&
        waitingForOperand
    ) {

        currentOperator = operator;

        updateDisplay();

        return;
    }


    // If there is already an operation
    if (previousInput !== null && currentOperator !== null) {

        const result = calculate(
            previousInput,
            inputValue,
            currentOperator
        );


        // Division by zero
        if (result === "Error") {

            showError();

            return;
        }


        currentInput = formatNumber(result);

        previousInput = result;

    }

    else {

        previousInput = inputValue;
    }


    currentOperator = operator;

    waitingForOperand = true;

    justCalculated = false;

    updateDisplay();
}


// =========================================
// CALCULATE RESULT
// =========================================

function calculate(firstNumber, secondNumber, operator) {

    switch (operator) {

        case "+":

            return firstNumber + secondNumber;


        case "-":

            return firstNumber - secondNumber;


        case "*":

            return firstNumber * secondNumber;


        case "/":

            if (secondNumber === 0) {

                return "Error";
            }

            return firstNumber / secondNumber;


        default:

            return secondNumber;
    }
}


// =========================================
// EQUALS
// =========================================

function calculateResult() {

    if (
        previousInput === null ||
        currentOperator === null
    ) {

        return;
    }


    const secondInput = parseFloat(currentInput);


    if (Number.isNaN(secondInput)) {

        return;
    }


    const result = calculate(
        previousInput,
        secondInput,
        currentOperator
    );


    // Division by zero
    if (result === "Error") {

        showError();

        return;
    }


    previousDisplay.textContent =
        `${formatNumber(previousInput)}
        ${getOperatorSymbol(currentOperator)}
        ${formatNumber(secondInput)} =`;


    currentInput = formatNumber(result);

    previousInput = null;

    currentOperator = null;

    waitingForOperand = false;

    justCalculated = true;


    updateDisplay();
}


// =========================================
// CLEAR CALCULATOR
// =========================================

function clearCalculator() {

    currentInput = "0";

    previousInput = null;

    currentOperator = null;

    waitingForOperand = false;

    justCalculated = false;


    updateDisplay();
}


// =========================================
// DELETE LAST CHARACTER
// =========================================

function deleteLastCharacter() {

    if (justCalculated) {

        clearCalculator();

        return;
    }


    if (waitingForOperand) {

        return;
    }


    if (currentInput.length <= 1) {

        currentInput = "0";
    }

    else {

        currentInput =
            currentInput.slice(0, -1);
    }


    updateDisplay();
}


// =========================================
// DIVISION BY ZERO ERROR
// =========================================

function showError() {

    currentInput = "Error";

    previousDisplay.textContent =
        "Cannot divide by zero";

    previousInput = null;

    currentOperator = null;

    waitingForOperand = true;

    justCalculated = false;

    display.textContent = "Error";
}


// =========================================
// OPERATOR SYMBOLS
// =========================================

function getOperatorSymbol(operator) {

    switch (operator) {

        case "+":

            return "+";

        case "-":

            return "−";

        case "*":

            return "×";

        case "/":

            return "÷";

        default:

            return "";
    }
}


// =========================================
// FORMAT RESULT
// =========================================

function formatNumber(number) {

    if (!Number.isFinite(number)) {

        return "Error";
    }


    // Avoid very long decimal values
    const rounded =
        Number(number.toFixed(10));


    return rounded.toString();
}


// =========================================
// NUMBER BUTTON EVENT LISTENERS
// =========================================

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        const value =
            button.dataset.number;


        if (value === ".") {

            inputDecimal();

        }

        else {

            inputNumber(value);
        }

    });

});


// =========================================
// OPERATOR BUTTON EVENT LISTENERS
// =========================================

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        const operator =
            button.dataset.operator;


        selectOperator(operator);
    });

});


// =========================================
// CLEAR BUTTON
// =========================================

clearButton.addEventListener(
    "click",
    clearCalculator
);


// =========================================
// DELETE BUTTON
// =========================================

deleteButton.addEventListener(
    "click",
    deleteLastCharacter
);


// =========================================
// EQUALS BUTTON
// =========================================

equalsButton.addEventListener(
    "click",
    calculateResult
);


// =========================================
// KEYBOARD SUPPORT
// =========================================

document.addEventListener("keydown", event => {

    const key = event.key;


    // Numbers
    if (
        key >= "0" &&
        key <= "9"
    ) {

        inputNumber(key);

        return;
    }


    // Decimal
    if (key === ".") {

        inputDecimal();

        return;
    }


    // Operators
    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        selectOperator(key);

        return;
    }


    // Equals
    if (
        key === "Enter" ||
        key === "="
    ) {

        calculateResult();

        return;
    }


    // Backspace
    if (key === "Backspace") {

        deleteLastCharacter();

        return;
    }


    // Escape / Delete
    if (
        key === "Escape" ||
        key === "Delete"
    ) {

        clearCalculator();

        return;
    }

});