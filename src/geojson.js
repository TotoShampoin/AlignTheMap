import { canvas } from "./draw.js"
import { L_map } from "./map.js";

export const getLatLngFromVector = (vector) => {
    const x = vector[0];
    const y = vector[1];
    const bounds = L_map.getBounds();
    const center = bounds.getCenter();
    const north  = bounds.getNorth();
    const south  = bounds.getSouth();
    const east   = bounds.getEast();
    const west   = bounds.getWest();
    const lat = center.lat + y / canvas.height * (south - north);
    const lng = center.lng + x / canvas.width * (east - west);
    return {lat, lng};
}

export const getVectorFromLatLng = (lat, lng) => {
    const bounds = L_map.getBounds();
    const center = bounds.getCenter();
    const north  = bounds.getNorth();
    const south  = bounds.getSouth();
    const east   = bounds.getEast();
    const west   = bounds.getWest();
    const y = (lat - center.lat) * (canvas.height / (south - north));
    const x = (lng - center.lng) * (canvas.width / (east - west));
    return [x, y];
}

export const getGeoFromPolies = (polygons) => {
    /* export as MultiPolygon */
    const geojson = {
        type: "MultiPolygon",
        coordinates: polygons.map(polygon => {
            return polygon.map(coords => {
                return getVectorFromLatLng(coords[0], coords[1]);
            });
        })
    }
    return geojson;
}