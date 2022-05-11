import * as IO from "./io.js";
import * as MAP from "./map.js";
import * as DRAW from "./draw.js";
import * as MATH from "./math.js";
import { unzip } from "./exporter.js";
import { getGeoFromPolies } from "./geojson.js";

const data = {
    selected: "",
    selection: [],
    points: {
        O: {x: -320, y: -240},
        A: {x:  320, y: -240},
        B: {x: -320, y:  240},
    },
    /** @type {[number,number,number,number]} */ matrix: [],
    /** @type {[number,number][][]} */polygons: [],
    width: 640,
    height: 480,
    image: null,
    preview: false,
}
window.data = data;

const setMatrix = () => {
    const vecA = MATH.subVectors(
        MATH.makeVector(data.points.A),
        MATH.makeVector(data.points.O)
    );
    const vecB = MATH.subVectors(
        MATH.makeVector(data.points.B),
        MATH.makeVector(data.points.O)
    );
    data.matrix = MATH.makeMatrixFromTwoVecs(vecA, vecB);
}
setMatrix();

const applyMatrix = (polygon, scaleX = 1, scaleY = 1) => polygon.map(point => {
    const p = [
        point[0] / scaleX,
        point[1] / scaleY
    ];
    return MATH.addVectors(
        MATH.multiplyVecMatrix(p, data.matrix),
        MATH.makeVector(data.points.O)
    )
});

const resetAxes = () => {
    data.points.O.x = -320;
    data.points.O.y = -240;
    data.points.A.x = 320;
    data.points.A.y = -240;
    data.points.B.x = -320;
    data.points.B.y = 240;
    setMatrix();
    data.selected = "";
    data.selection = [];
    IO.updateSelect(data.selection);
}


IO.handlers.onCoordsChange = (lat = 0, lng = 0, zoom = 12) => {
    MAP.setCoords(lat, lng, zoom);
}
IO.handlers.onSelect = (id) => {
    if(id === "") data.selected = "";
    data.selected = id.toUpperCase();

    if(IO.elements.keys_down.includes("Shift")) {
        if(data.selection.includes(data.selected)) {
            data.selection.splice(data.selection.indexOf(data.selected), 1);
        } else {
            data.selection.push(data.selected);
        }
    } else {
        if(data.selected === "") {
            data.selection = [];
        } else {
            if(!data.selection.includes(data.selected)) {
                data.selection = [data.selected];
            }
        }
    }
    IO.updateSelect(data.selection);
}
IO.handlers.onReset = () => {
    resetAxes();
}
IO.handlers.onPolygonImport = async (array_buffer) => {
    const [image, meta, polies] = await unzip(array_buffer);
    data.image = image;
    data.polygons = polies;
    data.width = meta.width;
    data.height = meta.height;
}

/* set coords to Paris */
IO.changeCoords(48.851, 2.339, 12);
IO.changeSelect("");

IO.handlers.onMouseClick = () => {
    const {x, y} = DRAW.getPixelPosition(IO.elements.mouse_pos);
    for(let keys of Object.keys(data.points)) {
        if(
            Math.sqrt(
                Math.pow(x - data.points[keys].x, 2) +
                Math.pow(y - data.points[keys].y, 2)
            ) < 36
        ) {
            IO.changeSelect(keys);
            return;
        }
    }
    IO.changeSelect("");
}

IO.handlers.onGeoPreview = (on = false) => {
    if(on) {
        let max_x = data.width;
        let max_y = data.height;
        if(data.polygons.length > 0) {
            const pol = data.polygons.map(polygon => applyMatrix(polygon, max_x, max_y));
            MAP.placePolygons(pol);
        }
        data.preview = true;
    } else {
        MAP.placePolygons([]);
        data.preview = false;
    }
}
IO.handlers.onGeoExport = () => {
    const geo = getGeoFromPolies(data.polygons);
    const blob = new Blob([JSON.stringify(geo)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "geo.json";
    a.click();
}

function mouse_behavior() {
    if(IO.elements.mouse_down && data.selection.length > 0) {
        const {x, y} = IO.elements.mouse_move;
        for(let key of data.selection) {
            data.points[key].x += x;
            data.points[key].y += y;
        }
        setMatrix();
    }
}
function display() {
    /* get max x and y of polygons */
    let max_x = data.width;
    let max_y = data.height;
    if(data.image) {
        DRAW.applyMatrix([
            data.matrix[0], data.matrix[2], data.matrix[1],
            data.matrix[3], data.points.O.x, data.points.O.y
        ], () => {
        DRAW.applyOpacity(0.75, () => {
            try { DRAW.image(data.image, 0, 0, 1, 1); } catch(e) {}
        })});
    }
    DRAW.polygon(applyMatrix([[0, 0], [0, 1], [1, 1], [1, 0]]), "#060", 3);
    if(data.polygons.length > 0) {
        const pol = data.polygons.map(polygon => applyMatrix(polygon, max_x, max_y));
        pol.forEach(polygon => DRAW.polygon(polygon, "#A005", 1));
    }
    for(let keys of Object.keys(data.points)) {
        const selec = data.selection.includes(keys);
        DRAW.circle(data.points[keys].x, data.points[keys].y, selec ? 24 : 12, "#00A");
        DRAW.text(data.points[keys].x, data.points[keys].y + (selec ? 2 : 1), keys, "#FFF", `600 ${selec ? 24 : 12}px Segoe UI`);
    }
}

function loop() {
    DRAW.clear();
    if(!data.preview) {
        mouse_behavior();
        display();
    }
    requestAnimationFrame(loop);
} loop();
