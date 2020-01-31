import { getBackground, elementToString } from "./svg.js";

const svgDataURLPrefix = "data:image/svg+xml;utf8,";

const backgroundElementID = "background";
const zigCenter = [50, 50];
const zigInnerRadius = 10;
const zigOuterRadius = 40;
const nPoints = 300;

function setBackgroundImage() {
  const background = document.getElementById(backgroundElementID);
  const backgroundSVG = getBackground(
    zigCenter,
    zigInnerRadius,
    zigOuterRadius,
    nPoints
  );
  const backgroundSVGString = elementToString(backgroundSVG);
  const backgroundImageString = `url('${svgDataURLPrefix}${backgroundSVGString}')`;
  background.style.backgroundImage = backgroundImageString;
}

const linksList = document.getElementById("links-list");

function toggleLinksList() {
  const display = linksList.style.display;
  linksList.style.display = display === "none" ? "" : "none";
}

setBackgroundImage();
const links = document.getElementById("links");
links.addEventListener("click", toggleLinksList);
toggleLinksList();
