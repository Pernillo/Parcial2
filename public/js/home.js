//obtiene la referencia al contenedor main
const main = document.querySelector(".mainListMovies");
var generos = [];

/* consigue el listado de generos */
fetch(
  genres_list_http +
    new URLSearchParams({
      api_key: api_key,
      language: "es",
    })
)//cuando termine de llamar los datos ejecuta esa funcion para poner los checbos
  .then((res) => res.json())
  .then((data) => {
    listCheckboxesGenero(data); // cargar generos 
    generos= data.genres;
    data.genres.forEach((item) => {
      fetchListaPeliculasPorGenero(item.id, item.name);
    });
  });

fetch(
  certification_movies +
    new URLSearchParams({
      api_key: api_key,
      language: "es",
    })
)
  .then((res) => res.json())
  .then((data) => {
    cargarSelectClasificaciones(data.certifications.US);
  });


 

const obtenerPeliCine = () => {
  fetch(
    peliculasCine +
      new URLSearchParams({
        api_key: api_key,
        page: Math.floor(Math.random() * 3) + 1, //trae pagina al azar
        language: "es", //se llama un parmatero de la api que regresa el idioma
      })
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      construirElementoCategoria("peliuclas en vistas en el cine", data.results);
    });
}


const buscarPelicula = (texto) => {
  fetch(
    busqueda +
      new URLSearchParams({
        query: texto,
        api_key: api_key,
        page: Math.floor(Math.random() * 3) + 1, //trae pagina al azar
        language: "es",
      })
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      construirElementoCategoria("resultado de busqueda", data.results);
    });
}

const fetchListaPeliculasPorGenero = (id, genres, otrosPrametros = {}) => {
  fetch(
    movie_genres_http +
      new URLSearchParams({
        api_key: api_key,
        with_genres: id,
        page: Math.floor(Math.random() * 3) + 1, //trae pagina al azar
        language: "es",
        ...otrosPrametros,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      // totalPelis.push({ category: `${genres}_movies`, results: data.results });
      construirElementoCategoria(`${genres}_movies`, data.results);
    })
    .catch((err) => console.log(err));
};

/* crea el titulo de categoria */
const construirElementoCategoria = (category, data) => {
  main.innerHTML += `
    <div class="movie-list">
        <button class="pre-btn"> <img src="img/pre.png" alt=""></button>
          
          <h1 class="movie-category">${category.split("_").join(" ")}</h1>

          <div class="movie-container" id="${category}">
          </div>

        <button class="nxt-btn"> <img src="img/nxt.png" alt=""> </button>
    </div>
    `;
  construirTarjetas(category, data);
};

const construirTarjetas = (id, data) => {
  const movieContainer = document.getElementById(id);
  data.forEach((item, i) => {
    if (item.backdrop_path == null) {
      item.backdrop_path = item.poster_path;
      if (item.backdrop_path == null) {
        return;
      }
    }

    movieContainer.innerHTML += `
        <div class="movie" onclick="location.href = '/${item.id}'">
            <img src="${img_url}${item.backdrop_path}" alt="">
            <p class="movie-title">${item.title}</p>
        </div>
        `;

    if (i == data.length - 1) {
      setTimeout(() => {
        setupScrolling();
      }, 100);
    }
  });
};

/* crea el titulo de categoria */
const cargarSelectClasificaciones = (data = []) => {
  const select = document.getElementById("Clasificiion");
  data.forEach((item) => {
    let option = document.createElement("option");
    option.text = item.certification;
    option.value = item.certification;
    select.add(option);
  });
};

/* Crear listado de generos checkboxs */
//genera el html con el listado de generos 
const listCheckboxesGenero = (data) => { // la data iniciada e un arreglo vacio
  const generos = data.genres;
  let divContenedor = document.getElementById("generos"); // en el html tiene un div de generos se selecciona la etiqueta
  let htmlCheckboxs = "";
  generos.forEach((genero, index) => { //un ciclo for esta tomado los elementos de genero recorre
    htmlCheckboxs += `
    <label for="${genero.name}">${genero.name}</label>
    <input class="checkboxGenero" type="checkbox" id="${genero.name}" name="${genero.name}" value="${genero.id}" >
    `;
  });
  divContenedor.innerHTML = htmlCheckboxs;// esta variable contiene todos y los asigna al contenedor y los muestra en div 
};

const correrFiltro = () => {
  let checkboxs = document.getElementsByClassName("checkboxGenero"); // seleccion de checbox con los que tenga la clase checkbox
  let generosSeleccionados = [];
  let otrosParametros = {};
  /* Depurar listado de generos seleccionados */
  for (let i = 0; checkboxs[i]; ++i) { // recorre todos los checbox
    if (checkboxs[i].checked) {
      generosSeleccionados.push({ // seleciona los que estan seleccionados y los inseta un objeto que tenga el id y el name
        id: checkboxs[i].value,
        name: checkboxs[i].name,
      });
    }
  }


  let textoBusqueda = document.getElementById("busqueda").value;
  if (textoBusqueda) {
    //console.log(busqueda);
    main.innerHTML="";
    buscarPelicula(textoBusqueda);
    //validamos que se haya ingreado el anio
    return;
   
  }
  /* Crear filtro de año */
  let anio = document.getElementById("anioLanzamiento").value;
  if (anio) {
    //validamos que se haya ingreado el anio
    otrosParametros.year = anio;
  }


  /* Crear filtro para adulto mejor calificada */
  let adultoMejorCalficada = document.getElementById("adultMejorCalificada"); // verica en en html si esta ingresado el dato entra en un if 
  if (adultoMejorCalficada.checked) {
    otrosParametros.include_adult = true;
    otrosParametros.sort_by = "vote_count.asc";
  }


  let peliculasCine = document.getElementById("peliculasCine"); // verica en en html si esta ingresado el dato entra en un if 
  if (peliculasCine.checked) {
    main.innerHTML="";
    obtenerPeliCine()
    return // si este filtro esta selecionada se sale de la funcion y se para 
  }

 
  /* Filtro de certificacion */
  let clasificacion = document.getElementById("Clasificiion").value;
  if (clasificacion && clasificacion != "0") {
    otrosParametros.certification_country = "US";
    otrosParametros.certification = clasificacion;
  }

  console.log({ otrosParametros }); // para ver en consola como trae los parametros
  main.innerHTML = "";

if (generosSeleccionados.length > 0){
  generosSeleccionados.forEach((genero) => {
    fetchListaPeliculasPorGenero(genero.id, genero.name, otrosParametros); //otros parametros tiene todos los filtros ingresados y por genero busca la info
  });
}else {
  generos.forEach((genero) => {
    fetchListaPeliculasPorGenero(genero.id, genero.name, otrosParametros); //otros parametros tiene todos los filtros ingresados y por genero busca la info
  });

}

  
  console.log({ generosSeleccionados });
};