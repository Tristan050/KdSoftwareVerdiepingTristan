// Api voor crypto prijzen & voor grafiek natuurlijk
const cryptoApiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=eur";

const wallet = {
    balance: 0, // Startwaarde in euro
    crypto: {
        BTC: 0,
        ETH: 0,
    },
};

let btcChart; // De BTC grafiek
let ethChart; // De ETH grafiek

// Haal de grafiekdata op uit localStorage of stelt in als het nog niet bestaat
function loadChartData() {
    const savedData = localStorage.getItem("chartData");
    if (savedData) {
        return JSON.parse(savedData);
    }
    return {
        labels: [],
        btcData: [],
        ethData: [],
    };
}

// Bewaar de grafiekdata in localStorage
function saveChartData(chartData) {
    localStorage.setItem("chartData", JSON.stringify(chartData));
}

// Initialiseer de grafieken
function initCharts(chartData) {
    const btcCtx = document.getElementById('btcChart').getContext('2d');
    btcChart = new Chart(btcCtx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'BTC Price (€)',
                borderColor: '#F2A900',
                data: chartData.btcData,
                fill: false,
                borderWidth: 2,
                pointRadius: 0,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'BTC Price (€)',
                    },
                    min: 86000, // Minimum waarde voor BTC
                    max: 92000, // Maximum waarde voor BTC
                    beginAtZero: false,
                },
            },
        },
    });

    const ethCtx = document.getElementById('ethChart').getContext('2d');
    ethChart = new Chart(ethCtx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'ETH Price (€)',
                borderColor: '#4CAF50',
                data: chartData.ethData,
                fill: false,
                borderWidth: 2,
                pointRadius: 0,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'ETH Price (€)',
                    },
                    min: 2800, // Minimum waarde voor ETH
                    max: 3200, // Maximum waarde voor ETH
                    beginAtZero: false,
                },
            },
        },
    });
}

// Update de grafiek met de nieuwe prijzen
async function updateChart(prices, chartData) {
    const currentTime = new Date();
    const timeLabel = currentTime.toLocaleTimeString();

    // Voeg nieuwe tijdstempel toe aan de labels en prijzen aan de datasets
    if (chartData.labels.length >= 60) { // Houdt maximaal 60 gegevenspunten bij (1 per minuut)
        chartData.labels.shift(); // Verwijder het oudste tijdstip
        chartData.btcData.shift(); // Verwijder de oudste BTC-prijs
        chartData.ethData.shift(); // Verwijder de oudste ETH-prijs
    }

    chartData.labels.push(timeLabel); // Voeg het nieuwe tijdstip toe
    chartData.btcData.push(prices.BTC); // Voeg de nieuwe BTC-prijs toe
    chartData.ethData.push(prices.ETH); // Voeg de nieuwe ETH-prijs toe

    // Bewaar de bijgewerkte grafiekdata
    saveChartData(chartData);

    // Update de grafieken
    btcChart.update();
    ethChart.update();
}

// Haal de crypto-prijzen op en update de grafiek
async function fetchCryptoPrices(chartData) {
    const response = await fetch(cryptoApiUrl);
    const data = await response.json();
    const prices = {
        BTC: data.bitcoin.eur,
        ETH: data.ethereum.eur,
    };

// Zet de live prijzen in de html
    if (prices && prices.BTC && prices.ETH) {
        document.getElementById("crypto-prices").innerHTML = `
<li><img src="images/btc.png" alt="BTC Logo" class="inline-block w-6 h-6"> BTC: €${prices.BTC}</li>
<li><img src="images/eth.png" alt="ETH Logo" class="inline-block w-6 h-6"> ETH: €${prices.ETH}</li>
`;
    } else {
        console.error("Error: Prices not available");
    }

    // Update de grafiek met de nieuwe prijzen
    updateChart(prices, chartData);

    return prices;
}

// Laad wallet vanuit localStorage
function loadWallet() {
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) {
        Object.assign(wallet, JSON.parse(savedWallet));
    }
    updateUI();
}

// Sla wallet op in localStorage
function saveWallet() {
    localStorage.setItem("wallet", JSON.stringify(wallet));
}

// Update UI
function updateUI() {
    document.getElementById("balance").innerText = `Balance: €${wallet.balance.toFixed(2)}`;
    const cryptoList = document.getElementById("crypto-balances");
    cryptoList.innerHTML = `
    <li><img src="images/btc.png" alt="BTC Logo" class="inline-block w-6 h-6"> BTC: ${wallet.crypto.BTC.toFixed(6)}</li>
    <li><img src="images/eth.png" alt="BTC Logo" class="inline-block w-6 h-6"> ETH: ${wallet.crypto.ETH.toFixed(6)}</li>
  `;
}

// Deposit functie
function deposit() {
    const amount = parseFloat(document.getElementById("amount").value);
    if (amount > 0) {
        wallet.balance += amount;
        saveWallet();
        updateUI();
        addTransaction("€ Deposit", amount);

        // Reset het input veld na een succesvolle deposit
        document.getElementById("amount").value = "";
    } else {
        alert("Enter a valid amount.");
    }
}


// Withdraw functie
function withdraw() {
    const amount = parseFloat(document.getElementById("amount").value);
    if (amount > 0 && wallet.balance >= amount) {
        wallet.balance -= amount;
        saveWallet();
        updateUI();
        addTransaction("€ Withdraw", amount);

        // Reset het input veld na een succesvolle withdraw
        document.getElementById("amount").value = "";
    } else {
        alert("Invalid amount or insufficient balance.");
    }
}


// Voeg transactie toe
function addTransaction(type, amount) {
    const date = new Date().toLocaleString();
    const table = document.getElementById("transaction-history");
    const row = document.createElement("tr");
    row.innerHTML = `
    <td class="border-b border-gray-300 py-2">${type}</td>
    <td class="border-b border-gray-300 py-2"> ${amount}</td>
    <td class="border-b border-gray-300 py-2">${date}</td>
  `;
    table.appendChild(row);
}

// Crypto kopen
async function buyCrypto() {
    const amount = parseFloat(document.getElementById("crypto-amount").value);
    const selectedCrypto = document.getElementById("crypto-select").value;

    if (amount > 0 && wallet.balance >= amount) {
        const prices = await fetchCryptoPrices();
        const cryptoPrice = prices[selectedCrypto];

        const cryptoAmount = amount / cryptoPrice;
        wallet.crypto[selectedCrypto] += cryptoAmount;
        wallet.balance -= amount;

        saveWallet();
        updateUI();
        addTransaction(`Buy ${selectedCrypto}`, amount);

        // Reset de invoervelden na de transactie
        document.getElementById("crypto-amount").value = "";
        document.getElementById("crypto-select").value = "BTC"; // Of stel een standaard waarde in zoals BTC
    } else {
        alert("Invalid amount or insufficient balance.");
    }
}


// Laad de gegevens en alles wordt ingesteld
window.onload = () => {
    const chartData = loadChartData();
    loadWallet();
    initCharts(chartData);
    fetchCryptoPrices(chartData);
    setInterval(() => fetchCryptoPrices(chartData), 60000); // Refresh de prijzen elke minuut
};

// Withdraw Crypto functie
async function withdrawCrypto() {
    const amount = parseFloat(document.getElementById("crypto-withdraw-amount").value);
    const selectedCrypto = document.getElementById("crypto-withdraw-select").value;

    if (amount > 0 && wallet.crypto[selectedCrypto] >= amount) {
    // Verminder de hoeveelheid van de crypto in de wallet
        wallet.crypto[selectedCrypto] -= amount;
        wallet.balance += amount * (await getCryptoPrice(selectedCrypto)); // Bereken de waarde van de crypto in EUR en voeg deze toe aan de balans

        saveWallet();
        updateUI();
        addTransaction(`Withdraw ${selectedCrypto} `, amount);

        // Reset de invoervelden na de transactie
        document.getElementById("crypto-withdraw-amount").value = "";
        document.getElementById("crypto-withdraw-select").value = "BTC"; // standaard waarde
    } else {
        alert("Invalid amount or insufficient balance.");
    }
}


// Haal de prijs op van de geselecteerde crypto (BTC of ETH)
async function getCryptoPrice(crypto) {
    const prices = await fetchCryptoPrices();
    return prices[crypto];
}