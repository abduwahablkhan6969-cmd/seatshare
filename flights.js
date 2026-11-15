const form = document.getElementById("flightSearchForm");
const statusBox = document.getElementById("flightStatus");
const resultsBox = document.getElementById("flightResults");
const API_URL = "https://seatshare-api.onrender.com/api/inventory/search";

function safeText(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const from = document.getElementById("flightFrom").value.trim();
  const to = document.getElementById("flightTo").value.trim();
  const date = document.getElementById("flightDate").value;

  if (from.toLowerCase() === to.toLowerCase()) {
    statusBox.textContent = "Choose two different cities or airports.";
    statusBox.className = "flight-status";
    resultsBox.innerHTML = "";
    return;
  }

  resultsBox.innerHTML = "";
  statusBox.textContent = "Contacting SeatShare's flight inventory service…";
  statusBox.className = "flight-status";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "flight", from, to, date })
    });
    const data = await response.json();

    if (!response.ok) {
      statusBox.textContent = data.message || "Flight inventory is not available yet. An approved provider connection is required.";
      return;
    }

    const offers = Array.isArray(data.results) ? data.results : [];
    if (!offers.length) {
      statusBox.textContent = "The provider returned no flight offers for this search.";
      return;
    }

    statusBox.textContent = `Provider returned ${offers.length} flight option(s). Prices and availability may change.`;
    statusBox.className = "flight-status success";
    resultsBox.innerHTML = offers.map(offer => `
      <article class="flight-result-card">
        <strong>${safeText(offer.airline || offer.operator || offer.name || "Flight option")}</strong>
        <span>${safeText(offer.departure || "Departure time not supplied")} → ${safeText(offer.arrival || "Arrival time not supplied")}</span>
        <span class="flight-price">${safeText(offer.currency || "INR")} ${safeText(offer.price ?? "Price unavailable")}</span>
        <small>${safeText(offer.details || "Review the provider's final itinerary and fare conditions before booking.")}</small>
      </article>`).join("");
  } catch (error) {
    statusBox.textContent = "Cannot reach the SeatShare backend. Please try again later.";
  }
});
