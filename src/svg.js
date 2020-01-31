const xmlns = "http://www.w3.org/2000/svg";

function fuzz(n, jitter) {
  const extra = (Math.random() * 2 - 1) * jitter * n;
  return n + extra;
}

function* circlePoints(cx, cy, radius, nPoints) {
  const unitAngle = (2 * Math.PI) / nPoints;
  for (let i = 0; i < nPoints; i += 1) {
    const angle = fuzz(unitAngle * i, 0.05);
    const x = cx + Math.sin(angle) * radius;
    const y = cy + Math.cos(angle) * radius;
    yield [x, y];
  }
}

function* zigPoints(center, innerRadius, outerRadius, nPoints) {
  const numInnerPoints = Math.floor(nPoints / 2);
  const numOuterPoints = nPoints - numInnerPoints;
  const innerPoints = circlePoints(...center, innerRadius, numInnerPoints);
  const outerPoints = circlePoints(...center, outerRadius, numOuterPoints);
  for (let i = 0; i < numOuterPoints; i += 1) {
    yield outerPoints.next();
    yield innerPoints.next();
  }
}

function getZigPathD(center, innerRadius, outerRadius, nPoints) {
  let d = "M";
  const points = [...zigPoints(center, innerRadius, outerRadius, nPoints)].map(
    result => result.value
  );
  d += points.reduce((coords, point) => {
    const [x, y] = point.map(coord => fuzz(coord, 0.1));
    return `${coords} ${x}, ${y}`;
  });
  return `${d} Z`;
}

function setAttributes(element, attributes) {
  const newElement = element.cloneNode(true);
  Object.entries(attributes).map(entry =>
    newElement.setAttributeNS(null, ...entry)
  );
  return newElement;
}

function getBackground(center, innerRadius, outerRadius, nPoints) {
  const svgElement = document.createElementNS(xmlns, "svg");
  svgElement.setAttributeNS(null, "viewBox", "0 0 100 100");

  let path = document.createElementNS(xmlns, "path");
  const initialD = getZigPathD(center, innerRadius, outerRadius, nPoints);
  const secondD = getZigPathD(center, innerRadius, outerRadius, nPoints);
  path = setAttributes(path, {
    d: initialD,
    fill: "none",
    stroke: "black",
    "stroke-width": "0.1"
  });

  let animate = document.createElementNS(xmlns, "animate");
  animate = setAttributes(animate, {
    attributeName: "d",
    from: initialD,
    to: initialD,
    values: `${initialD};${secondD};${initialD}`,
    repeatCount: "indefinite",
    dur: "25s"
  });

  path.appendChild(animate);
  svgElement.appendChild(path);
  return svgElement;
}

function elementToString(element) {
  return new XMLSerializer().serializeToString(element);
}

export { getBackground, elementToString };
