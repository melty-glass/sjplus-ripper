obj = JSON.parse(document.querySelector('#episode-json').getAttribute('data-value'));
const pages = obj.readableProduct.pageStructure.pages;
n = 1;

for (i of pages) {
    if (i.src) {
        // before auto-downloading the images, set the filename first
        // here, the order is 01, 02, 03 ... 97, 98, 99
        // feel free to change this by changing a.download
        n >= 10 ? g = n : g = `0${n}`;
        const a = document.createElement('a');
        a.download = `${g}.png`;

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

            // fuck yeah matrices
            let grid = [
                [
                    [], [], [], []], [
                    [], [], [], []], [
                    [], [], [], []], [
                    [], [], [], []
                ]
            ];

            // put width and height
            let hs = -h;
            for (i = 0; i < 4; i++) {
                hs += h;
                let ws = -w;
                for (j = 0; j < 4; j++) {
                    ws += w;
                    grid[i][j].push(ws, hs);
                };
            }; for (i = 0; i < 4; i++) {
                for (j = 0; j < 4; j++) {
                    // get image data from transposed matrix
                    
                    // if you go to {the chapter URL}.json and click on one of the pages,
                    // it'll be a 4x4 transposed grid of smaller images.
                    // this loop is meant reorder & push image data in the correct cells.
                    grid[i][j].push(c.getImageData(grid[j][i][0], grid[j][i][1], w, h));
                };
            }; for (i = 0; i < 4; i++) {
                for (j = 0; j < 4; j++) {
                    c.putImageData(grid[i][j][2], grid[i][j][0], grid[i][j][1]);
                };
            };

            a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            a.click();
        };
        n++;
    };
};
});
