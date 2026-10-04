// =========================================
// GET HTML ELEMENTS
// =========================================

const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");
const convertBtn = document.getElementById("convertBtn");

const errorMessage = document.getElementById("errorMessage");

const celsiusResult = document.getElementById("celsiusResult");
const fahrenheitResult = document.getElementById("fahrenheitResult");
const kelvinResult = document.getElementById("kelvinResult");


// =========================================
// CONVERT BUTTON EVENT
// =========================================

convertBtn.addEventListener("click", convertTemperature);


// =========================================
// MAIN CONVERSION FUNCTION
// =========================================

function convertTemperature() {

    // Clear previous error
    errorMessage.textContent = "";

    // Get input value
    const inputValue = temperatureInput.value.trim();

    // Validate empty input
    if (inputValue === "") {

        showError("Please enter a temperature value.");

        resetResults();

        return;
    }


    // Convert input to number
    const temperature = Number(inputValue);


    // Validate numeric input
    if (!Number.isFinite(temperature)) {

        showError("Please enter a valid numeric temperature.");

        resetResults();

        return;
    }


    // Get selected unit
    const selectedUnit = unitSelect.value;


    // Variables for converted temperatures
    let celsius;
    let fahrenheit;
    let kelvin;


    // =====================================
    // CONVERT FROM CELSIUS
    // =====================================

    if (selectedUnit === "celsius") {

        celsius = temperature;

        fahrenheit = (temperature * 9 / 5) + 32;

        kelvin = temperature + 273.15;
    }


    // =====================================
    // CONVERT FROM FAHRENHEIT
    // =====================================

    else if (selectedUnit === "fahrenheit") {

        fahrenheit = temperature;

        celsius = (temperature - 32) * 5 / 9;

        kelvin = celsius + 273.15;
    }


    // =====================================
    // CONVERT FROM KELVIN
    // =====================================

    else if (selectedUnit === "kelvin") {

        kelvin = temperature;

        celsius = temperature - 273.15;

        fahrenheit = (celsius * 9 / 5) + 32;
    }


    // =====================================
    // ABSOLUTE ZERO VALIDATION
    // =====================================

    if (celsius < -273.15) {

        showError(
            "Invalid temperature. Temperature cannot be below absolute zero (-273.15°C)."
        );

        resetResults();

        return;
    }


    // =====================================
    // DISPLAY RESULTS
    // =====================================

    celsiusResult.textContent =
        `${formatNumber(celsius)} °C`;

    fahrenheitResult.textContent =
        `${formatNumber(fahrenheit)} °F`;

    kelvinResult.textContent =
        `${formatNumber(kelvin)} K`;
}


// =========================================
// FORMAT NUMBER
// =========================================

function formatNumber(value) {

    return Number(value.toFixed(2));
}


// =========================================
// SHOW ERROR
// =========================================

function showError(message) {

    errorMessage.textContent = message;
}


// =========================================
// RESET RESULTS
// =========================================

function resetResults() {

    celsiusResult.textContent = "-- °C";

    fahrenheitResult.textContent = "-- °F";

    kelvinResult.textContent = "-- K";
}


// =========================================
// ENTER KEY SUPPORT
// =========================================

temperatureInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        convertTemperature();
    }
});