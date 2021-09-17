
//obtiene el parametro de la  pagina ejemplo
// localhost:3000/354345
// movie_id = /354345
let movie_id = location.pathname;

//obtener detalles de la pelicula, como parametro está el id de la pelicula
fetch(
  `${movie_detail_http}${movie_id}?` +
    new URLSearchParams({
      api_key: api_key,
      language: "es"
    })
)
  .then((res) => res.json())
  .then((data) => {
    setupMovieInfo(data);
  });

const setupMovieInfo = (data) => {
  const movieName = document.querySelector(".movie-name");
  const genres = document.querySelector(".genres");
  const des = document.querySelector(".des");
  const name = document.querySelector("name");
 const backdrop = document.querySelector(".movie-info");

  name.innerHTML = movieName.innerHTML = data.name;

  genres.innerHTML = `${data.release_date.split("-")[0]} | `;

  for (let i = 0; i < data.genres.length; i++) {
    genres.innerHTML +=
      data.genres[i].name + formatString(i, data.genres.length);
  }

  if (data.air_date == true) {
    genres.innerHTML += " | +18";
  }

  if (data.backdrop_path == null) {
    data.backdrop_path = data.poster_path;
  }

  des.innerHTML = data.overview.substring(0, 200) + "...";
  backdrop.style.backgroundImage = `url(${img_url}${data.backdrop_path})`;

   
};

const formatString = (currentIndex, maxIndex) => {
  return currentIndex == maxIndex - 1 ? "" : ", ";
};

//fetching cast info
//console.log(`${movie_detail_http} === ${movie_id}`);

fetch(
  `${movie_detail_http}${movie_id}/credits?` +
    new URLSearchParams({
      api_key: api_key,
      language: "es"
    })
)
  .then((res) => res.json())
  .then((data) => {
    const cast = document.querySelector(".starring");
    for (let i = 0; i < 5; i++) {
      cast.innerHTML += data.cast[i].name + formatString(i, 5);
    }
  });

//fetch el video

console.log(`${movie_detail_http}${movie_id}/videos?${api_key}`);
fetch(
  `${movie_detail_http}${movie_id}/videos?` +
    new URLSearchParams({
      api_key: api_key,
      language: "es"
    })
)
  .then((res) => res.json())
  .then((data) => {
    let trailerContainer = document.querySelector(".trailer-container");
    let maxClips = data.results.length > 4 ? 4 : data.results.length;
    console.log(maxClips);
    for (let i = 0; i < maxClips; i++) {
      console.log(data.results[i].key);
      trailerContainer.innerHTML += `
            <iframe src="https://youtube.com/embed/${data.results[i].key}" title="you tube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
    }
  });

//fetch las recomendaciones

fetch(
  `${movie_detail_http}${movie_id}/recommendations?` +
    new URLSearchParams({
      api_key: api_key,
      language: "es"
    })
)
  .then((res) => res.json())
  .then((data) => {
    let container = document.querySelector(".recommendations-container");
    for (let i = 0; i < 16; i++) {
      if (data.results[i].backdrop_path == null) {
        i++;
      }
      container.innerHTML += `
            <div class="movie" onClick="location.href= '/${data.results[i].id}'">
            <img src="${img_url}${data.results[i].backdrop_path}" alt="">
            <p class="movie-title">${data.results[i].name}</p>
            </div>
            `;
    }
  });
