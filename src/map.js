
const $_map = $("#map");

const L_map = L.map($_map[0], {
    center: [0, 0],
    zoom: 12,
    zoomControl: false,
    attributionControl: false,
    layers: [
        L.tileLayer(`https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png`, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
    ]
});

export const setCoords = (lat, lng, zoom = 12) => {
    L_map.setView([lat, lng], zoom);
}

