export const makeVector = ({x, y}) => {
    return [x, y];
}

export const makeMatrixFromTwoVecs = (vec1, vec2) => {
    return [
        vec1[0], vec2[0],
        vec1[1], vec2[1]
    ];
}

export const multiplyVecMatrix = (vec, matrix) => {
    const [x, y] = vec;
    const [A, B, C, D] = matrix;
    return [
        A * x + B * y,
        C * x + D * y
    ];
}

export const addVectors = (vec1, vec2) => {
    return [
        vec1[0] + vec2[0],
        vec1[1] + vec2[1]
    ];
}

export const subVectors = (vec1, vec2) => {
    return [
        vec1[0] - vec2[0],
        vec1[1] - vec2[1]
    ];
}

export const scaleVector = (vec, scale) => {
    return [
        vec[0] * scale,
        vec[1] * scale
    ];
}
