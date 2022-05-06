const $_select_points = $("#select-point-a, #select-point-b, #select-point-o");
const $_locs = $("#loc-lat, #loc-lng, #loc-zoom");
const $_import_polygon = $("#io-import-poly");
const $_import_geojson = $("#io-import-geo");
const $_export_geojson = $("#io-export-geo");
const $_map_zone = $("#map-zone");

export const handlers = {
    onCoordsChange: (lat = 0, lng = 0, zoom = 12) => {},
    onPolygonImport: (array = []) => {},
    onGeoImport: (geo = {}) => {},
    onGeoExport: () => ({}),
    onMouseClick: () => {},
    onMouseStop: () => {},
}
export const elements = {
    mouse_pos: {x: 0, y: 0},
    mouse_down: false,
}

$_locs.on("change", function(e) {
    const lat = $("#loc-lat").val();
    const lng = $("#loc-lng").val();
    const zoom = $("#loc-zoom").val();
    handlers.onCoordsChange(lat, lng, zoom);
});

$_select_points.on("click", function(e) {
    const id = $(this).attr("id").replace("select-point-", "");
    $_select_points.removeClass("selected");
    $(this).addClass("selected");
    handlers.onSelect(id);
});

$_import_polygon.on("click", function(e) {
    const $file = $("<input type='file' id='file-input' accept='.json' />");
    $file.on("change", function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const array = JSON.parse(e.target.result);
            handlers.onPolygonImport(array);
        }
        reader.readAsText(file);
    });
    $file.trigger("click");
});

$_map_zone.on("mousemove", function(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    elements.mouse_pos.x = x;
    elements.mouse_pos.y = y;
});
$_map_zone.on("mousedown", function(e) {
    elements.mouse_down = true;
    handlers.onMouseClick();
});
$_map_zone.on("mouseup", function(e) {
    elements.mouse_down = false;
});

/**
 * 
 * @param {number} lat 
 * @param {number} lng 
 * @param {number} zoom 
 */
export const changeCoords = (lat, lng, zoom) => {
    $("#loc-lat").val(lat);
    $("#loc-lng").val(lng);
    $("#loc-zoom").val(zoom);
    $_locs.trigger("change");
}

/**
 * 
 * @param {"A" | "B" | "C"} id 
 */
export const changeSelect = (id) => {
    if(id === "") {
        $_select_points.removeClass("selected");
        handlers.onSelect(id);
    } else {
        $(`#select-point-${id.toLowerCase()}`).trigger("click");
    }
}
