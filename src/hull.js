import { crossProduct, distance } from "./common";

async function grahamScan(points) {
  // 找到y坐标最小的点，如果有多个，则取x坐标最小的
  let start = points[0];
  for (const p of points) {
    if (p.y < start.y || (p.y === start.y && p.x < start.x)) {
      start = p;
    }
  }

  // 按极角排序，如果极角相同，则按距离排序
  points.sort((a, b) => {
    const cp = crossProduct(start, a, b);
    if (cp === 0) {
      return distance(start, a) - distance(start, b);
    }
    return cp > 0 ? -1 : 1;
  });

  // 初始化凸包栈
  const stack = [start];

  // 构建凸包
  for (let i = 1; i < points.length; i++) {
    while (
      stack.length > 1 &&
      crossProduct(
        stack[stack.length - 2],
        stack[stack.length - 1],
        points[i]
      ) <= 0
    ) {
      stack.pop();
    }
    stack.push(points[i]);
  }

  return stack;
}

export function computeConvexHull(points) {
  return grahamScan(points);
}
