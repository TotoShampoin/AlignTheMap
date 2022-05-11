/** @type {HTMLCanvasElement} */ export const canvas = $("#canvas")[0];
/** @type {CanvasRenderingContext2D} */ export const ctx = canvas.getContext("2d");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
$(window).on("resize", () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.resetTransform();
    ctx.translate(canvas.width / 2, canvas.height / 2);

});
ctx.translate(canvas.width / 2, canvas.height / 2);

export const clear = () => {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
}

export const pixel = (x, y, color = "black") => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

export const getPixelPosition = ({x, y}) => {
    return {
        x: x - canvas.width / 2,
        y: y - canvas.height / 2
    };
}

export const line = (x1, y1, x2, y2, color = "black", stroke = 1) => {
    ctx.beginPath();
    ctx.lineWidth = stroke;
    ctx.strokeStyle = color;
    ctx.lineWidth = stroke;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

export const circle = (x, y, radius, color = "black", stroke = 0) => {
    ctx.beginPath();
    ctx.lineWidth = stroke;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    if(stroke) {
        ctx.stroke();
    } else {
        ctx.fill();
    }
}

export const rect = (x, y, width, height, color = "black", stroke = 0) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.rect(x, y, width, height);
    if(stroke) {
        ctx.stroke();
    } else {
        ctx.fill();
    }
}

export const polygon = (points, color = "black", stroke = 0) => {
    ctx.beginPath();    ctx.lineWidth = stroke;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.moveTo(points[0][0], points[0][1]);
    for(let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.closePath();
    if(stroke) {
        ctx.stroke();
    } else {
        ctx.fill();
    }
}

export const text = (x, y, text, color = "black", font = "12px Arial") => {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
}

export const image = (image, x, y, w, h) => {
    ctx.drawImage(image, x, y, w, h);
}

/**
 * 
 * @param {[number,number,number,number,number,number]} matrix 
 * @param {() => void} callback 
 */
export const applyMatrix = (matrix, callback = () => {}) => {
    ctx.save();
    ctx.transform(...matrix);
    callback();
    ctx.restore();
}

export const applyOpacity = (opacity, callback = () => {}) => {
    ctx.globalAlpha = opacity;
    callback();
    ctx.globalAlpha = 1;
}