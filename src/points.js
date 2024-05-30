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

/**
 * 被包围的点，值置为2。
 * @param {[1|0, ...]} arr 
 * @param {number} width 
 * @param {number} height
 * 
 * @returns new Arr
 */
function filterOutUselessPoints(arr, width, height, clone) {
  const newArr = clone ? arr.slice() : arr;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const index = i * height + j;
      if (newArr[index] === 1 && isSurroundedByPoints(newArr, i, j, width, height)) {
        newArr[index] = 2;
      }
    }
  }
  return newArr;
}

/**
 * 判断index(i, j)是否被1或2包围
 * @param {[1|0, ...]} arr 
 * @param {number} i 
 * @param {number} j 
 * @param {number} width 
 * @param {number} height 
 * @returns 
 */
function isSurroundedByPoints(arr, i, j, width, height) {
  const offsets = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  for (const [offsetI, offsetJ] of offsets) {
    const newI = i + offsetI;
    const newJ = j + offsetJ;

    if (newI >= 0 && newI < width && newJ >= 0 && newJ < height) {
      const index = newI * height + newJ;
      if (arr[index] !== 1 && arr[index] !== 2) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
}

export function pixelValuesToPoints(pixelValues, width, height) {
  const filteredPixelValues = filterOutUselessPoints(pixelValues, width, height);
  const points = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const value = filteredPixelValues[index];
      if (value !== 0) {
        points.push([x, y]);
      }
    }
  }
  return points;
}
