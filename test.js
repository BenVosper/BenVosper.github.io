const svgDataURLPrefix = 'data:image/svg+xml;utf8,';
const xmlns = "http://www.w3.org/2000/svg";

const innerRadius = 10;
const outerRadius = 40
const nPoints = 300;
const center = [50, 50];


function fuzz(n, jitter) {
    let extra = ((Math.random() * 2) - 1) * jitter * n;
    return n + extra
}


function* circlePoints(cx, cy, radius, nPoints) {
    var points = [];
    const unitAngle = 2 * Math.PI / nPoints;
    for (let i = 0; i < nPoints; i++) {
        var angle = fuzz(unitAngle * i, 0.05);
        var x = cx + (Math.sin(angle) * radius);
        var y = cy + (Math.cos(angle) * radius);
        yield [fuzz(x, 0.1), fuzz(y, 0.1)];
    }
}

function* zigPoints(cx, cy, innerRadius, outerRadius, nPoints) {
    const numInnerPoints = Math.floor(nPoints / 2);
    const numOuterPoints = nPoints - numInnerPoints;
    var innerPoints = circlePoints(cx, cy, innerRadius, numInnerPoints);
    var outerPoints = circlePoints(cx, cy, outerRadius, numOuterPoints);
    for (let i = 0; i < numOuterPoints; i++) {
        yield outerPoints.next();
        yield innerPoints.next();
    }

}

function getZigPathD(cx, cy, innerRadius, outerRadius, nPoints) {
    var d = "M";
    const points = [...zigPoints(cx, cy, innerRadius, outerRadius, nPoints)].map( result => result.value );
    d = d + points.reduce((coords, point) => `${coords} ${point[0]}, ${point[1]}`);
    d = d + "Z";
    return d;
}


function createBackground() {
    var svgElem = document.createElementNS(xmlns, "svg");
    svgElem.setAttributeNS(null, "viewBox", "0 0 100 100");
    var path = document.createElementNS(xmlns, "path");
    var initialD = getZigPathD(...center, innerRadius, outerRadius, nPoints);
    var secondD = getZigPathD(...center, innerRadius, outerRadius, nPoints);
    path.setAttributeNS(null, "d", initialD);
    path.setAttributeNS(null, "fill", "none");
    path.setAttributeNS(null, "stroke", "black");
    path.setAttributeNS(null, "stroke-width", "0.1");
    var animate = document.createElementNS(xmlns, "animate");
    animate.setAttributeNS(null, "attributeName", "d");
    animate.setAttributeNS(null, "from", initialD);
    animate.setAttributeNS(null, "to", initialD);
    animate.setAttributeNS(null, "values", `${initialD};${secondD};${initialD}`);
    animate.setAttributeNS(null, "repeatCount", "indefinite");
    animate.setAttributeNS(null, "dur", "25s");
    path.appendChild(animate);
    svgElem.appendChild(path);
    var svgString = new XMLSerializer().serializeToString(svgElem);
    return `url('${svgDataURLPrefix}${svgString}')`
}


$().ready(function() {
   document.getElementById("background").style.backgroundImage = createBackground();
});