// Api voor crypto prijzen & voor grafiek natuurlijk
const cryptoApiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=eur";

const wallet = {
    balance: 0,
    crypto: {
        BTC: 0,
        ETH: 0,
    },
};

let btcChart;
let ethChart;

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

function saveChartData(chartData) {
    localStorage.setItem("chartData", JSON.stringify(chartData));
}

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
                    min: 95000,
                    max: 105000,
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
                    min: 2500,
                    max: 3500,
                    beginAtZero: false,
                },
            },
        },
    });
}

async function updateChart(prices, chartData) {
    const currentTime = new Date();
    const timeLabel = currentTime.toLocaleTimeString();

    if (chartData.labels.length >= 60) {
        chartData.labels.shift();
        chartData.btcData.shift();
        chartData.ethData.shift();
    }

    chartData.labels.push(timeLabel);
    chartData.btcData.push(prices.BTC);
    chartData.ethData.push(prices.ETH);

    btcChart.update();
    ethChart.update();
}

async function fetchCryptoPrices(chartData) {
    const response = await fetch(cryptoApiUrl);
    const data = await response.json();
    const prices = {
        BTC: data.bitcoin.eur,
        ETH: data.ethereum.eur,
    };

    if (prices && prices.BTC && prices.ETH) {
        document.getElementById("crypto-prices").innerHTML = `
<li><img src="images/btc.png" alt="BTC Logo" class="inline-block w-6 h-6"> BTC: €${prices.BTC}</li>
<li><img src="images/eth.png" alt="ETH Logo" class="inline-block w-6 h-6"> ETH: €${prices.ETH}</li>
`;
    } else {
        console.error("Error: Prices not available");
    }

    updateChart(prices, chartData);

    return prices;
}

function loadWallet() {
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) {
        Object.assign(wallet, JSON.parse(savedWallet));
    }
    updateUI();
}

function saveWallet() {
    localStorage.setItem("wallet", JSON.stringify(wallet));
}

function updateUI() {
    document.getElementById("balance").innerText = `Balance: €${wallet.balance.toFixed(2)}`;
    const cryptoList = document.getElementById("crypto-balances");
    cryptoList.innerHTML = `
    <li><img src="images/btc.png" alt="BTC Logo" class="inline-block w-6 h-6"> BTC: ${wallet.crypto.BTC.toFixed(6)}</li>
    <li><img src="images/eth.png" alt="BTC Logo" class="inline-block w-6 h-6"> ETH: ${wallet.crypto.ETH.toFixed(6)}</li>
  `;
}

function deposit() {
    const amount = parseFloat(document.getElementById("amount").value);
    if (amount > 0) {
        wallet.balance += amount;
        saveWallet();
        updateUI();
        addTransaction("€ Deposit", amount);

        document.getElementById("amount").value = "";
    } else {
        alert("Enter a valid amount.");
    }
}


function withdraw() {
    const amount = parseFloat(document.getElementById("amount").value);
    if (amount > 0 && wallet.balance >= amount) {
        wallet.balance -= amount;
        saveWallet();
        updateUI();
        addTransaction("€ Withdraw", amount);

        document.getElementById("amount").value = "";
    } else {
        alert("Invalid amount or insufficient balance.");
    }
}


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

        document.getElementById("crypto-amount").value = "";
        document.getElementById("crypto-select").value = "BTC";
    } else {
        alert("Invalid amount or insufficient balance.");
    }
}


window.onload = () => {
    const chartData = loadChartData();
    loadWallet();
    initCharts(chartData);
    fetchCryptoPrices(chartData);
    setInterval(() => fetchCryptoPrices(chartData), 60000);
};

async function withdrawCrypto() {
    const amount = parseFloat(document.getElementById("crypto-withdraw-amount").value);
    const selectedCrypto = document.getElementById("crypto-withdraw-select").value;

    if (amount > 0 && wallet.crypto[selectedCrypto] >= amount) {
        wallet.crypto[selectedCrypto] -= amount;
        wallet.balance += amount * (await getCryptoPrice(selectedCrypto));

        saveWallet();
        updateUI();
        addTransaction(`Withdraw ${selectedCrypto} `, amount);

        document.getElementById("crypto-withdraw-amount").value = "";
        document.getElementById("crypto-withdraw-select").value = "BTC";
    } else {
        alert("Invalid amount or insufficient balance.");
    }
}


async function getCryptoPrice(crypto) {
    const prices = await fetchCryptoPrices();
    return prices[crypto];
}