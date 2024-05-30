import { getBoundingBox, mergeClosePoints } from "./common";
import { findPerpendicularsPointsInCircle } from "./concave";
import { computeConvexHull } from "./hull";
import { extractPixelValues, loadImage, pixelValuesToPoints } from "./points";

export async function computeConvexHullFromImage(imagePath) {
  const image = await loadImage(imagePath);
  const { pixelValues, width, height } = extractPixelValues(image);
  const points = pixelValuesToPoints(pixelValues, width, height);
  const hullPoints = await computeConvexHull(points);
  const { left, top, right, bottom } = getBoundingBox(hullPoints);
  const aroundCenter = [
    Math.floor((left + right) / 2),
    Math.floor((top + bottom) / 2)
  ];
  const closeMergedPoints = mergeClosePoints(hullPoints);
  const concavePendingPoints = []; // point | null
  for (let i = 0; i < closeMergedPoints.length; i++) {
    const pointA = closeMergedPoints[i];
    let pointB = closeMergedPoints[i + 1];
    if (!pointB) {
      pointB = closeMergedPoints[0];
    }
    const concavePoints = findPerpendicularsPointsInCircle(pointA, pointB, aroundCenter);
    if (concavePoints.length > 0) {
      const concave = concavePoints.find(([x, y]) => pixelValues[(y * width + x)] > 0);
      concavePendingPoints.push(concave ? concave : null);
    } else {
      concavePendingPoints.push(null);
    }
  }

  const resultPoints = [];
  for (let i = 0; i < closeMergedPoints.length; i++) {
    const hull = closeMergedPoints[i];
    const concave = concavePendingPoints[i];
    resultPoints.push(hull);
    if (concave) {
      resultPoints.push(concave);
    }
  }

  // console.log('concavePoints', {
  //   hullPoints,
  //   closeMergedPoints,
  //   concavePendingPoints,
  //   resultPoints
  // });
  return { resultPoints, originSize: { width, height} };
}