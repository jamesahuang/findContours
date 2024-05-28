/**
 * 
 * @param {[x, y]} o 
 * @param {[x, y]} a 
 * @param {[x, y]} b 
 * @returns 
 */
export function crossProduct(o, a, b) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

/**
 * 
 * @param {[x, y]} a 
 * @param {[x, y]} b 
 * @returns 
 */
export function distance(a, b) {
  return (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2;
}

/**
 * 
 * @param {[[x, y], ...]} points 
 * @returns { left, top, right, bottom }
 */
export function getBoundingBox(points) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const point of points) {
    const [x, y] = point;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  return { left: minX, top: minY, right: maxX, bottom: maxY };
}

/**
 * 
 * @param {[[x,y], ...]} points 
 * @param {number} distanceThreshold 
 * @returns {[[x,y], ...]} merged points
 */
export function mergeClosePoints(points, distanceThreshold = 5) {
  let result = [];
  let i = 0;

  while (i < points.length) {
    let j = i + 1;
    let count = 1;

    // 动态计算连续距离小于5的点的数量
    while (j < points.length && distance(points[j - 1], points[j]) < distanceThreshold) {
      j++;
      count++;
    }

    if (count > 1) {
      // 如果找到连续的点，取中间的那个点
      let middleIndex = Math.floor((i + j - 1) / 2);
      result.push(points[middleIndex]);
      i = j; // 移动到下一个未处理的点
    } else {
      // 如果没有找到连续的点，直接添加当前点
      result.push(points[i]);
      i++;
    }
  }

  return result;
}