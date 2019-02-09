import { getBackground, elementToString } from "./svg.js";

const svgDataURLPrefix = 'data:image/svg+xml;utf8,';

const backgroundElementID = "background";
const zigCenter = [50, 50];
const zigInnerRadius = 10;
const zigOuterRadius = 40
const nPoints = 300;


function setBackgroundImage() {
    let background = document.getElementById("background");
    let backgroundSVG = getBackground(zigCenter, zigInnerRadius, zigOuterRadius, nPoints);
    let backgroundSVGString = elementToString(backgroundSVG);
    let backgroundImageString = `url('${svgDataURLPrefix}${backgroundSVGString}')`;
    background.style.backgroundImage = backgroundImageString;
}


$().ready(() => {
    setBackgroundImage();
});
