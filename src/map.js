import { getLatLngFromVector } from "./geojson.js";

const $_map = $("#map");

let preview;

export const L_map = L.map($_map[0], {
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

/**
 * 
 * @param {[number, number][][]} polygons 
 */
export const placePolygons = (polygons) => {
    if(preview && L_map.hasLayer(preview)) L_map.removeLayer(preview);
    const latlng_pol = polygons.map((polygon) => polygon.map((coords) => getLatLngFromVector(coords)));
    if(latlng_pol.length > 0) {
        preview = L.polygon(latlng_pol, {
            color: "#ff0000",
            weight: 1,
            fillColor: "#ff0000",
            fillOpacity: 0.5
        }).addTo(L_map);
    }
}


window.L_map = L_map;
