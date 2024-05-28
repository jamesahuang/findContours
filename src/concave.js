/**
 * 
 * @param {[number, number]} A 
 * @param {[number, number]} B 
 * @param {[number, number]} aroundCenter 
 * @returns [[number, number]]
 */
export function findPerpendicularsPointsInCircle(A, B, aroundCenter) {
    const [x1, y1] = A[1] <= B[1] ? A : B;
    const [x2, y2] = A[1] > B[1] ? A : B;

    // 计算AB的中点坐标
    const M = [(x1 + x2) / 2, (y1 + y2) / 2];

    // 计算AB的斜率
    const kAB = (x2 - x1) === 0 ? Infinity : (y2 - y1) / (x2 - x1);

    // 计算中垂线的斜率
    const kM = kAB === Infinity ? 0 : -1 / kAB;

    // 计算中垂线的截距
    const bM = M[1] - kM * M[0];

    // 计算圆的半径
    const radius = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) / 2;

    // 计算圆心坐标
    const center = [(x1 + x2) / 2, (y1 + y2) / 2];

    // 初始化结果数组
    const result = [];

    let offsets = [0, 0];
    let isClockwiseRight = undefined;

    if (aroundCenter) {
        const [xc, yc] = aroundCenter;
        const crossProduct = (x2 - x1) * (yc - y1) - (y2 - y1) * (xc - x1);
        if (crossProduct > 0) {
            // 左
            offsets[1] = -radius;
            isClockwiseRight = false;
        } else if (crossProduct < 0) {
            // 右
            offsets[0] = radius;
            isClockwiseRight = true;
        }
    }

    const rounding = (n, isY) => {
        if (isClockwiseRight === undefined) {
            return n;
        }
        return isClockwiseRight ^ isY ? Math.ceil(n) : Math.floor(n);
    }

    // 水平
    if (kAB === 0) {
        for (let x = rounding(center[0], false), y = rounding(center[1] - radius + offsets[0], true); y <= center[1] + radius + offsets[1]; y++) {
            result.push([x, y]);
        }
    } else {
        // 遍历所有可能的x值
        for (let x = rounding(center[0] - radius + offsets[0], false); x <= center[0] + radius + offsets[1]; x++) {
            // 计算对应的y值
            let y = rounding(kM * x + bM, true);

            // 判断点是否在圆内
            if (Math.sqrt(Math.pow(x - center[0], 2) + Math.pow(y - center[1], 2)) <= radius) {
                result.push([x, y]);
            }
        }
    }
    if (isClockwiseRight === false) {
        result.reverse();
    }

    return result;
}