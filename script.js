const table = document.querySelector("table");
const button_Mkt_Cap = document.getElementById("Mkt_Cap");
const button_percentage = document.getElementById("percentage");
const search = document.querySelector("input");

const URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

async function fetchData() {
  try {
    const res = await fetch(URL);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err.message);
  }
}

button_Mkt_Cap.addEventListener("click", sortByMktCap);
button_percentage.addEventListener("click", sortByPercentage);
search.addEventListener("input", searchData);

function searchData(e) {
  let query = e.target.value.toLowerCase();
  let data = JSON.parse(sessionStorage.getItem("data"));
  let res = data.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.symbol.toLowerCase().includes(query)
  );
  renderTable(res);
}

function sortByMktCap() {
  let data = JSON.parse(sessionStorage.getItem("data"));
  let res = data.toSorted((b, a) => a.market_cap - b.market_cap);
  renderTable(res);
}

function sortByPercentage() {
  let data = JSON.parse(sessionStorage.getItem("data"));
  let res = data.toSorted(
    (b, a) =>
      a.market_cap_change_percentage_24h - b.market_cap_change_percentage_24h
  );
  renderTable(res);
}

function renderTable(data) {
  table.innerHTML = "";
  data.forEach((item) => {
    table.innerHTML += `<tr>
    <td>
      <div id="currency">
        <img
          src=${item.image}      
        />
        <p>${item.name}</p>
      </div>
    </td>
    <td>${item.symbol.toUpperCase()}</td>
    <td>$${item.current_price}</td>
    <td>$${item.total_volume.toLocaleString("en-IN")}</td>
    ${
      item.market_cap_change_percentage_24h > 0
        ? `<td style="color:green">${item.market_cap_change_percentage_24h}&#37;</td>`
        : `<td style="color:red">${item.market_cap_change_percentage_24h}&#37;</td>`
    }
    <td>Mkr Cap:  $${item.market_cap.toLocaleString("en-IN")}</td>
    </tr>`;
  });
}

window.onload = () => {
  fetchData().then((data) => {
    renderTable(data);
    sessionStorage.setItem("data", JSON.stringify(data));
  });
};
