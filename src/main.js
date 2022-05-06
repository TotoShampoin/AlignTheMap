import * as IO from "./io.js";
import * as MAP from "./map.js";
import * as DRAW from "./draw.js";
import * as MATH from "./math.js";

const data = {
    selected: "",
    points: {
        O: {x: -320, y: -240},
        A: {x:  320, y: -240},
        B: {x: -320, y:  240},
    },
    /** @type {[number,number,number,number]} */ matrix: [],
    /** @type {[number,number][][]} */polygons: []
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


IO.handlers.onCoordsChange = (lat = 0, lng = 0, zoom = 12) => {
    MAP.setCoords(lat, lng, zoom);
}
IO.handlers.onSelect = (id) => {
    if(id === "") data.selected = "";
    data.selected = id.toUpperCase();
}
IO.handlers.onPolygonImport = (array) => {
    data.polygons = array;
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

function mouse_behavior() {
    if(IO.elements.mouse_down && data.selected !== "") {
        const {x, y} = DRAW.getPixelPosition(IO.elements.mouse_pos);
        data.points[data.selected].x = x;
        data.points[data.selected].y = y;
        setMatrix();
    }
}
function display() {
    DRAW.clear();
    DRAW.polygon(applyMatrix([[0, 0], [0, 1], [1, 1], [1, 0]]), "#060", 3);
    /* get max x and y of polygons */
    let max_x = 0;
    let max_y = 0;
    for(let polygon of data.polygons) {
        for(let point of polygon) {
            if(point[0] > max_x) {
                max_x = point[0];
            }
            if(point[1] > max_y) {
                max_y = point[1];
            }
        }
    }
    if(data.polygons.length > 0) {
        const pol = data.polygons.map(polygon => applyMatrix(polygon, max_x, max_y));
        pol.map(polygon => DRAW.polygon(polygon, "#f00", 1));
    }
    for(let keys of Object.keys(data.points)) {
        const selec = data.selected === keys;
        DRAW.circle(data.points[keys].x, data.points[keys].y, selec ? 24 : 12, "#00A");
        DRAW.text(data.points[keys].x, data.points[keys].y + (selec ? 2 : 1), keys, "#FFF", `600 ${selec ? 24 : 12}px Segoe UI`);
    }
}

function loop() {
    mouse_behavior();
    display();
    requestAnimationFrame(loop);
} loop();
