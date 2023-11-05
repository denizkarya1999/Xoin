// Declare global variables for left and right elements
var leftCurrencyNameElement, leftSymbolElement, leftSupplyElement, leftPriceElement, leftChangeElement, leftDropdownElement, left_investButton;
var rightCurrencyNameElement, rightSymbolElement, rightSupplyElement, rightPriceElement, rightChangeElement, rightDropdownElement, right_investButton;

// Perform actions upon loading
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the left and right elements
    leftCurrencyNameElement = document.querySelector(".left_currency_name");
    leftSymbolElement = document.getElementById("left_symbol");
    leftSupplyElement = document.getElementById("left_supply");
    leftPriceElement = document.getElementById("left_price");
    leftChangeElement = document.getElementById("left_change");
    leftDropdownElement = document.getElementById("left_dropdown_content");
    left_investButton = document.getElementById("left_invest_button");

    rightCurrencyNameElement = document.querySelector(".right_currency_name");
    rightSymbolElement = document.getElementById("right_symbol");
    rightSupplyElement = document.getElementById("right_supply");
    rightPriceElement = document.getElementById("right_price");
    rightChangeElement = document.getElementById("right_change");
    rightDropdownElement = document.getElementById("right_dropdown_content");
    right_investButton = document.getElementById("right_invest_button");

    // Add event listeners to the dropdown menus
    leftDropdownElement.addEventListener("click", function () {
        displaySelectedData(this.value, leftCurrencyNameElement, leftSymbolElement, leftSupplyElement, leftPriceElement, leftChangeElement, left_investButton);
    });

    rightDropdownElement.addEventListener("click", function () {
        displaySelectedData(this.value, rightCurrencyNameElement, rightSymbolElement, rightSupplyElement, rightPriceElement, rightChangeElement, right_investButton);
    });

    fetchData(leftDropdownElement, rightDropdownElement);
});

// Function to fetch and process data from the CoinCap API
function fetchData(leftDropdownElement, rightDropdownElement) {
    fetch('https://api.coincap.io/v2/assets')
        .then(response => response.json())
        .then(data => {
            // Populate the dropdown menus
            populateDropdown(leftDropdownElement, data.data);
            populateDropdown(rightDropdownElement, data.data);
        })
        .catch(error => {
            alert('Error fetching data:');
        });
}

// Function to populate the dropdown menus
function populateDropdown(dropdownElement, items) {
    items.forEach(item => {
        // Create an anchor element
        const link = document.createElement("a");
        link.href = "#"; 
        link.textContent = item.name;

        // Create an option element
        const option = document.createElement("option");
        option.value = item.id;
        option.appendChild(link);

        dropdownElement.appendChild(option);
    });
}

// Function to display selected data
function displaySelectedData(selectedValue, currencyNameElement, symbolElement, supplyElement, priceElement, changeElement, invest_button) {
    // Fetch data for the selected cryptocurrency using its ID
    fetch(`https://api.coincap.io/v2/assets/${selectedValue}`)
        .then(response => response.json())
        .then(data => {
            // Change values into a fixed format
            const supplyValue = parseFloat(data.data.supply);
            const roundedSupply = supplyValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const priceValue = parseFloat(data.data.priceUsd);
            const roundedPrice = priceValue.toFixed(2);
            const changeValue = parseFloat(data.data.changePercent24Hr);
            const roundedValue = changeValue .toFixed(2);

            // Display the relevant data in the elements
            currencyNameElement.innerHTML = `<strong>${data.data.name}</strong>`;
            symbolElement.innerHTML = `Symbol: <strong>${data.data.symbol}</strong>`;
            supplyElement.innerHTML = `Supply: <strong>${roundedSupply}</strong>`;
            priceElement.innerHTML = `Price $: <strong>${roundedPrice}</strong>`;
            changeElement.innerHTML = `% Change (24H): <strong>${roundedValue}</strong>`;
            invest_button.innerHTML = `<a href="${data.data.explorer}"> Invest Now</a>`;
        })
        .catch(error => {
            alert('Error fetching selected data:');
        });
}