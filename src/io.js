const $_select_points = $("#select-point-a, #select-point-b, #select-point-o");
const $_select_reset = $("#select-reset");
const $_locs = $("#loc-lat, #loc-lng, #loc-zoom");
const $_import_polygon = $("#io-import-poly");
const $_import_geojson = $("#io-import-geo");
const $_export_geojson = $("#io-export-geo");
const $_preview_geo = $("#io-preview-geo");
const $_map_zone = $("#map-zone");

export const handlers = {
    onSelect: (id) => {},
    onReset: () => {},
    onCoordsChange: (lat = 0, lng = 0, zoom = 12) => {},
    onPolygonImport: (file) => {},
    onGeoImport: (geo = {}) => {},
    onGeoExport: () => ({}),
    onGeoPreview: (on = false) => {},
    onMouseClick: () => {},
    onMouseStop: () => {},
}
export const elements = {
    mouse_pos: {x: 0, y: 0},
    mouse_move: {x: 0, y: 0},
    mouse_down: false,
    keys_down: [],
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
$_select_reset.on("click", function(e) {
    handlers.onReset();
});

$_import_polygon.on("click", function(e) {
    const $file = $("<input type='file' id='file-input' accept='.zip' />");
    $file.on("change", function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            handlers.onPolygonImport(e.target.result);
        }
        reader.readAsArrayBuffer(file);
    });
    $file.trigger("click");
});

$_export_geojson.on("click", function(e) {
    handlers.onGeoExport();
});

$_preview_geo.on("click", function(e) {
    $_preview_geo.toggleClass("selected");
    handlers.onGeoPreview($_preview_geo.hasClass("selected"));
});

$_map_zone.on("mousemove", function(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    elements.mouse_move.x = x - elements.mouse_pos.x;
    elements.mouse_move.y = y - elements.mouse_pos.y;
    elements.mouse_pos.x = x;
    elements.mouse_pos.y = y;
}).on("mousedown", function(e) {
    elements.mouse_down = true;
    handlers.onMouseClick();
}).on("mouseup", function(e) {
    elements.mouse_down = false;
});
$(window).on("keydown", function(e) {
    elements.keys_down.push(e.key);
}).on("keyup", function(e) {
    elements.keys_down = elements.keys_down.filter(key => key !== e.key);
});
setInterval(() => {
    elements.mouse_move.x = 0;
    elements.mouse_move.y = 0;
}, 0);

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
 * @param {"A" | "B" | "O"} id 
 */
export const changeSelect = (id) => {
    if(id === "") {
        $_select_points.removeClass("selected");
        handlers.onSelect(id);
    } else {
        $(`#select-point-${id.toLowerCase()}`).trigger("click");
    }
}

/**
 * 
 * @param {("A" | "B" | "O")[]} selection 
 */
export const updateSelect = (selection) => {
    $_select_points.removeClass("selected");
    selection.forEach(id => {
        $(`#select-point-${id.toLowerCase()}`).addClass("selected");
    });
}
