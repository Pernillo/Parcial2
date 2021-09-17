
//obtiene la referencia al contenedor main
const main = document.querySelector(".main");

/* consigue el listado de generos 
fetch(
  genres_list_http +
    new URLSearchParams({
      api_key: api_key,
    })
)
  .then((res) => res.json())
  .then((data) => {
    data.genres.forEach((item) => {
      fetchListaPeliculasPorGenero(item.id, item.name);
    });
  });*/

  fetch(
    url_generos +
    new URLSearchParams({
        api_key: api_key,
        language: "es",

    })
  )
  .then((res) => res.json())
  .then((data) => {
    data.genres.forEach((item) => {
      fetchListaPeliculasPorGenero(item.id, item.name);
    });
  });
  
  




const fetchListaPeliculasPorGenero = (id, genres) => {
  fetch(
    series_http +
      new URLSearchParams({
        api_key: api_key,
        with_genres: id,
        page: Math.floor(Math.random() * 3) + 1, //trae pagina al azar
        language: "es",
      })
  )
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      construirElementoCategoria(`${genres}_series`, data.results);
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
            <p class="movie-title">${item.name}</p>
        </div>
        `;

    if (i == data.length - 1) {
      setTimeout(() => {
        setupScrolling();
      }, 100);
    }
  });
};