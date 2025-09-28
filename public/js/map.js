document.addEventListener("DOMContentLoaded", function() {
  if (window.listingCoords) {
    const coords = [window.listingCoords[1], window.listingCoords[0]]; // lat, lon
    const map = L.map('map').setView(coords, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker(coords).addTo(map)
      .bindPopup(`<h3> <b> Here is your location</b></h3>`)
      .openPopup();
  }
});
