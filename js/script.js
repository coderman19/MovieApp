const API_KEY = 'd203475d-12a4-4ffd-a53c-4ad078e50597';
const API_URL_POPULAR = 
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';

const API_URL_SEARCH =
  'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';

const API_URL_MOVIE_DETAILS = 
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

getMovies(API_URL_POPULAR);

// получаем список фильмов
async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  showMovies(respData);
}

// определяем цвета по категориям
function getClassByRate(vote) {
  if (vote >= 7) {
    return 'green';
  } else if (vote > 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

// render response from server
function showMovies(data) {
  const moviesEl = document.querySelector('.movies');

  // очищаем предыдущий список
  document.querySelector('.movies').innerHTML = '';

  data.films.forEach((movie) => {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `
      <div class="movie__cover-inner">
      <img 
        class="movie__cover"
        src="${movie.posterUrlPreview}" 
        alt="${movie.nameRu}"
        >
        <div class="movie__cover--darkened"></div>
      </div>
      <div class="movie__info">
        <div class="movie__title">${movie.nameRu}</div>
        <div class="movie__category">${movie.genres.map(
          (genre) => `${genre.genre}`
          )}</div>
        <div class="movie__year">${movie.year}</div>
        <div class="movie__average movie__average--${getClassByRate(movie.rating)}">${movie.rating}</div>
      </div>
    `;
    // открываем модальное окно по клику
    movieEl.addEventListener('click', () => openModal(movie.filmId))
    moviesEl.appendChild(movieEl);
  })
}


// получаем данные от поиска
const form = document.querySelector('form');
const search = document.querySelector('.header__search');

// навешиваем слушатель события на форму
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if(search.value) {
    getMovies(apiSearchUrl);

    // очищаем поле ввода
    search.value = '';
  }
})

// отлавливаем элемент modal

const modalEl = document.querySelector(".modal");

async function openModal(id) {
  // получаем через API описание фильма
  const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  
  const respData = await resp.json();

  modalEl.classList.add('modal--show');
  document.body.classList.add('stop--scrolling');

modalEl.innerHTML = `
  <div class="modal__card">
  <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="modal">
  <h2>
    <span class="modal__movie-title">${respData.nameRu}</span>
    <span class="modal__movie-release-year">${respData.year}</span>
  </h2>
  <ul class="modal__movie-info">
    <div class="loader"></div>
    <li class="modal__movie-genre">жанр: ${respData.genres.map(
      (genre) => `${genre.genre} `)}</li>
    ${respData.filmLength ? `<li class="modal__movie-runtime">время - ${respData.filmLength} минут</li>` : ''}
    <li>сайт: <a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
    <li class="modal__movie-overview">описание - ${respData.description}</li>
  </ul>
  <button class="modal__button-close" type="button">закрыть</button>
  </div>
`
  const btnClose = document.querySelector('.modal__button-close')
  btnClose.addEventListener('click', () => closeModal())
};


// закрываем модальное окно по нажатию на кнопку
function closeModal() {
  modalEl.classList.remove('modal--show');
  document.body.classList.remove('stop--scrolling');
}

// закрываем модальное окно по нажатию на свободное место
window.addEventListener('click', (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
})

// закрываем модальное окно по нажатию на ESC
window.addEventListener('keydown', (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
})


