const slideQueryParam = "slide";

const getSlides = () => {
  return [...document.querySelectorAll("li.splide__slide")];
};

const getSlideName = (slide) => {
  const slideImg = slide.querySelector("img");
  if (!slideImg) {
    return null;
  }
  const imgPath = slideImg.getAttribute("data-splide-lazy");
  if (!imgPath) {
    return null;
  }
  const pathComponents = imgPath.split("/");
  return pathComponents.length
    ? pathComponents[pathComponents.length - 1]
    : null;
};

const onLoad = () => {
  const slides = getSlides();
  const slideNames = slides.map(getSlideName);

  const searchParams = new URLSearchParams(window.location.search);
  const targetSlideName = searchParams.get(slideQueryParam);
  const startIndex = targetSlideName ? slideNames.indexOf(targetSlideName) : 0;

  const splide = new Splide(".splide", {
    type: "loop",
    focus: "center",
    perPage: 1,
    perMove: 1,
    keyboard: "global",
    start: startIndex,
    lazyLoad: "nearby",
  });

  splide.mount();

  splide.on("moved", (newIndex, prevIndex, destIndex) => {
    const slideName = slideNames[newIndex];
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(slideQueryParam, slideName);
    const newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  });
};

document.addEventListener("DOMContentLoaded", onLoad);
