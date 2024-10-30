// Get selected bathroom count from radio buttons
function getBathValue() {
  const uiBathrooms = document.getElementsByName("uiBathrooms");
  for (let i = 0; i < uiBathrooms.length; i++) {
    if (uiBathrooms[i].checked) {
      return parseInt(uiBathrooms[i].value);
    }
  }
  return -1; // return -1 if nothing is selected
}

// Get selected BHK count from radio buttons
function getBHKValue() {
  const uiBHK = document.getElementsByName("uiBHK");
  for (let i = 0; i < uiBHK.length; i++) {
    if (uiBHK[i].checked) {
      return parseInt(uiBHK[i].value);
    }
  }
  return -1; // return -1 if nothing is selected
}

// Function to handle price estimation
async function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  const sqft = parseFloat(document.getElementById("uiSqft").value);
  const bhk = getBHKValue();
  const bathrooms = getBathValue();
  const location = document.getElementById("uiLocations").value;
  const estPrice = document.getElementById("uiEstimatedPrice");
  const url = "https://bangalore-home-prices-backend.vercel.app/predict_home_price";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        total_sqft: sqft,
        bhk: bhk,
        bath: bathrooms,
        location: location
      })
    });

    if (!response.ok) throw new Error(`Error: ${response.statusText}`);

    const data = await response.json();
    data.estimated_price = data.estimated_price / 100000;
    estPrice.innerHTML = `<h2>${data.estimated_price.toString()} Lakh</h2>`;
    console.log("Price estimation:", data.estimated_price);

  } catch (error) {
    console.error("Failed to estimate price:", error);
    estPrice.innerHTML = `<h2>Error estimating price</h2>`;
  }
}

// Function to load location options on page load
async function onPageLoad() {
  console.log("Document loaded");
  const url = "https://bangalore-home-prices-backend.vercel.app/get_location_names";
  const uiLocations = document.getElementById("uiLocations");

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);

    const data = await response.json();
    console.log("Received locations:", data.locations);

    // Populate location dropdown
    uiLocations.innerHTML = ""; // Clear any existing options
    data.locations.forEach(location => {
      const option = document.createElement("option");
      option.value = location;
      option.textContent = location;
      uiLocations.appendChild(option);
    });

  } catch (error) {
    console.error("Failed to load location names:", error);
  }
}

// Attach onPageLoad to window load event
window.onload = onPageLoad;
