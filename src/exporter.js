// import JSZip from "../includes/jszip.js";

/**
 * 
 * @param {[HTMLImageElement, {}, []]} param0 
 * @returns {Promise<Blob>}
 */
export const zip = ([image, meta, polies]) => {
    const zip = new JSZip();
    return new Promise((resolve, reject) => {
        JSZipUtils.getBinaryContent(image, (err, data) => {
            if(err) reject(err);
            zip.file("image.png", data, {binary: true});
            resolve();
        });
    }).then(() => {
        zip.file("meta.json", JSON.stringify(meta));
        zip.file("polies.json", JSON.stringify(polies));
        return zip.generateAsync({ type: "base64" })
    }).then((base64) => {
        return "data:application/zip;base64," + base64;
    });
}

/**
 * 
 * @param {Blob} blob 
 * @returns {Promise<[HTMLImageElement, {}, []]>}
 */
export const unzip = (array_buffer) => {
    const zip = new JSZip();
    return zip.loadAsync(array_buffer).then(() => {
        const image = zip.file("image.png").async("uint8array").then((data) => {
            const pixels = new Uint8ClampedArray(data);
            const image = new Image();
            image.src = URL.createObjectURL(new Blob([pixels], {type: "image/png"}));
            console.log(image);
            return image;
        });
        const meta = zip.file("meta.json").async("string").then((data) => JSON.parse(data));
        const polies = zip.file("polies.json").async("string").then((data) => JSON.parse(data));
        return Promise.all([image, meta, polies]);
    });
}
