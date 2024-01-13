url = window.location.toString().concat('.json');

fetch(url)
    .then(data => data.json())
    .then(obj => {
        const pages = obj.readableProduct.pageStructure.pages;
        let n = 1;

        for (i of pages) {
            if (i.src) {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = i.src;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    w = Math.floor(img.width / 32) * 8;
                    h = Math.floor(img.height / 32) * 8;

                    const c = canvas.getContext("2d");
                    c.drawImage(img, 0, 0);

                    // automate this later, possibly use nested array matrix
                    const grid12 = c.getImageData(w, 0, w, h);
                    const grid13 = c.getImageData(2 * w, 0, w, h);
                    const grid14 = c.getImageData(3 * w, 0, w, h);

                    const grid21 = c.getImageData(0, h, w, h);
                    const grid23 = c.getImageData(2 * w, h, w, h);
                    const grid24 = c.getImageData(3 * w, h, w, h);

                    const grid31 = c.getImageData(0, 2 * h, w, h);
                    const grid32 = c.getImageData(w, 2 * h, w, h);
                    const grid34 = c.getImageData(3 * w, 2 * h, w, h);

                    const grid41 = c.getImageData(0, 3 * h, w, h);
                    const grid42 = c.getImageData(w, 3 * h, w, h);
                    const grid43 = c.getImageData(2 * w, 3 * h, w, h);

                    c.putImageData(grid21, w, 0);
                    c.putImageData(grid31, 2 * w, 0);
                    c.putImageData(grid41, 3 * w, 0);

                    c.putImageData(grid12, 0, h);
                    c.putImageData(grid32, 2 * w, h);
                    c.putImageData(grid42, 3 * w, h);

                    c.putImageData(grid13, 0, 2 * h);
                    c.putImageData(grid23, w, 2 * h);
                    c.putImageData(grid43, 3 * w, 2 * h);

                    c.putImageData(grid14, 0, 3 * h);
                    c.putImageData(grid24, w, 3 * h);
                    c.putImageData(grid34, 2 * w, 3 * h);

                    n >= 10 ? g = n : g = `0${n}`;
                    
                    let a = document.createElement('a');
                    a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                    a.download = `${g}.png`;
                    a.click();

                    n++;
                }
            }
        }
    });