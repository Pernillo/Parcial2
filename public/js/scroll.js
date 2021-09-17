
//aqui se define la funcion para hacer scrolling con el listado de las peliculas
const setupScrolling = () => {
  const conainter = [...document.querySelectorAll(".movie-container")];
  const nxtBtn = [...document.querySelectorAll(".nxt-btn")];
  const preBtn = [...document.querySelectorAll(".pre-btn")];

  // iteracion de todos los contenedores de peliculas (DIV)
  conainter.forEach((item, i) => {
    let containerDimensions = item.getBoundingClientRect();
    let containerWidth = containerDimensions.width;

    //boton siguiente >
    nxtBtn[i].addEventListener("click", () => {
      item.scrollLeft += containerWidth;
    });


    //boton previo <
    preBtn[i].addEventListener("click", () => {
      item.scrollLeft -= containerWidth;
    });
  });
};
