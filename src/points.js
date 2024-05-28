const ALPHA_THRESHOLD = 30;

export async function loadImage(imagePath) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imagePath;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
}

export function extractPixelValues(image) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixelValues = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    // const r = imageData.data[i];
    // const g = imageData.data[i + 1];
    // const b = imageData.data[i + 2];
    // const gray = (r + g + b) / 3;
    // pixelValues.push(gray);

    const a = imageData.data[i + 3];
    pixelValues.push(a > ALPHA_THRESHOLD ? 1 : 0);
  }
  return { pixelValues, width: canvas.width, height: canvas.height };
}

export function pixelValuesToPoints(pixelValues, width, height) {
  const points = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const value = pixelValues[index];
      if (value !== 0) {
        points.push([x, y]);
      }
    }
  }
  return points;
}
