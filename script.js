const currencySymbols = { usd: '$', eur: '€', gbp: '£', inr: '₹' };
const options = { method: 'GET', headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-pvd9HFzmVzanK758mVaXxjJD' } };

let currentPage = 1;
const recordsPerPage = 10;
let cryptoData = [];

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }
}


window.addEventListener('load', hideLoader);

document.querySelector("#show-login").addEventListener("click",function(){
  document.querySelector(".signin-popup").classList.add("active");
})

document.querySelector(".close-btn").addEventListener("click",function(){
  document.querySelector(".signin-popup").classList.remove("active");
})

function fetchCryptoData() {
  const currency = document.getElementById('currency-select').value;
  const currencySymbol = currencySymbols[currency] || '';

  fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=40&page=1&sparkline=false&price_change_percentage=24h`, options)
    .then(response => response.json())
    .then(data => {
      cryptoData = data;
      renderTable();
    })
    .catch(err => console.error(err));
}

function renderTable() {
  const tableBody = document.querySelector('.crypto-table tbody');
  tableBody.innerHTML = ''; 
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedData = cryptoData.slice(startIndex, endIndex);

  paginatedData.forEach((coin, index) => {
    const priceChange = coin.price_change_percentage_24h;
    const priceChangeColor = priceChange < 0 ? 'red' : 'green';
    const priceChangeArrow = priceChange < 0
      ? '<i class="fa-solid fa-arrow-down"></i>'  
      : '<i class="fa-solid fa-arrow-up"></i>';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${startIndex + index + 1}</td>
      <td>
        <img src="${coin.image}" alt="${coin.name}" style="width:20px;height:20px;margin-right:10px;">
        ${coin.name} (${coin.symbol.toUpperCase()})
      </td>
      <td>${currencySymbols[document.getElementById('currency-select').value]} ${coin.current_price.toLocaleString()}</td>
      <td style="color: ${priceChangeColor};">${priceChange.toFixed(2)}% ${priceChangeArrow}</td>
    `;
    tableBody.appendChild(row);
  });

  updatePaginationControls();
}

function updatePaginationControls() {
  document.getElementById('prev-btn').disabled = currentPage === 1;
  document.getElementById('next-btn').disabled = currentPage * recordsPerPage >= cryptoData.length;
}

function changePage(direction) {
  const newPage = currentPage + direction;
  if (newPage > 0 && newPage * recordsPerPage <= cryptoData.length) {
    currentPage = newPage;
    renderTable();
  }
}

function filterTable() {
  const searchInput = document.getElementById('search-box').value.toLowerCase();
  const filteredData = cryptoData.filter(coin => coin.name.toLowerCase().includes(searchInput));
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const tableBody = document.querySelector('.crypto-table tbody');
  tableBody.innerHTML = '';

  paginatedData.forEach((coin, index) => {
      const priceChange = coin.price_change_percentage_24h;
      const priceChangeColor = priceChange < 0 ? 'red' : 'green';
      const priceChangeArrow = priceChange < 0
          ? '<i class="fa-solid fa-arrow-down"></i>'
          : '<i class="fa-solid fa-arrow-up"></i>';

      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${startIndex + index + 1}</td>
          <td>
              <img src="${coin.image}" alt="${coin.name}" style="width:20px;height:20px;margin-right:10px;">
              ${coin.name} (${coin.symbol.toUpperCase()})
          </td>
          <td>${currencySymbols[document.getElementById('currency-select').value]} ${coin.current_price.toLocaleString()}</td>
          <td style="color: ${priceChangeColor};">${priceChange.toFixed(2)}% ${priceChangeArrow}</td>
      `;
      tableBody.appendChild(row);
  });

  updatePaginationControls();
}
document.getElementById('search-box').addEventListener('keyup', filterTable);




fetchCryptoData();
