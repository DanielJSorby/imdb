const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");
const searchInput = document.querySelector("[data-search]");
const favouriteCheckbox = document.querySelector(".checkbox");
const lastInnStart = 20;
// URL til JSON-filen
var url =
  "https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json";

var selectYear = document.getElementById("year");
selectYear.onchange = (event) => {
  var inputText = event.target.value;
  if (inputText === "All") {
    url =
      "https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json";
  } else {
    url =
      "https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies-" +
      inputText +
      "s.json";
  }
  console.log(url);
  searchMovies("");
  return url;
};

var movies = [];

// Funksjon for å hente filmene
function fetchMovies() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      movies = data;
      searchMovies("");
    })
    .catch((error) => console.error("Error:", error));
}

// Funksjon for å søke gjennom filmene
function searchMovies(searchTerm, onlyFavourites = false) {
  let result;
  if (onlyFavourites) {
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    result = movies.filter((movie) =>
      favourites.some((favMovie) => favMovie.title === movie.title)
    );
  } else if (searchTerm.trim() === "") {
    // Hvis søkefeltet er tomt, velg lastInnStart tilfeldige filmer
    result = [];
    for (let i = 0; i < lastInnStart; i++) {
      result.push(movies[Math.floor(Math.random() * movies.length)]);
    }
  } else {
    // Filtrer filmene basert på søkeordet
    result = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Begrenser resultatene til de første 50
    result = result.slice(0, 50);
  }

  // Tømmer userCardContainer
  userCardContainer.innerHTML = "";

  // Lager nye kort for hvert søke resultat
  result.forEach((movie) => {
    const card = userCardTemplate.content.cloneNode(true).children[0];
    const header = card.querySelector("[data-header]");
    const body = card.querySelector("[data-body]");
    const thumbnail = card.querySelector("[data-thumbnail]");
    const info = card.querySelector("[data-info]");
    const favouriteButton = card.querySelector(".favourite-button");

    if (movie.thumbnail === "" || movie.thumbnail === undefined) {
      thumbnail.src = "./bilder/ingen-bilde.jpeg";
      thumbnail.alt = "Filmplakat ikke tilgjengelig";
    } else {
      thumbnail.src = movie.thumbnail;
      thumbnail.alt = movie.title;
    }

    header.textContent = movie.title;
    body.textContent = "Year: " + movie.year;
    info.textContent = movie.extract;
    // Favoritter
    // Oppdater knappens tekst når kortet blir laget
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    let exists = favourites.some((favMovie) => favMovie.title === movie.title);
    favouriteButton.textContent = exists
      ? "Remove from favourites"
      : "Add to favourites";

    favouriteButton.addEventListener("click", () => {
      // Sjekk om filmen allerede finnes i favorittlisten
      let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
      exists = favourites.some((favMovie) => favMovie.title === movie.title);

      if (exists) {
        // Hvis filmen allerede finnes, fjern den fra listen
        favourites = favourites.filter(
          (favMovie) => favMovie.title !== movie.title
        );
      } else {
        // Hvis filmen ikke allerede finnes, legg den til i listen
        favourites.push(movie);
      }

      localStorage.setItem("favourites", JSON.stringify(favourites));

      // Oppdater favourites variabelen med den nye listen med favoritter
      favourites = JSON.parse(localStorage.getItem("favourites")) || [];

      // Sjekk om filmen allerede finnes i favorittlisten
      exists = favourites.some((favMovie) => favMovie.title === movie.title);

      // Oppdater knappens tekst etter at favorittlisten er oppdatert
      favouriteButton.textContent = exists
        ? "Remove from favourites"
        : "Add to favourites";

      localStorage.setItem("favourites", JSON.stringify(favourites));

      // Oppdater favourites variabelen med den nye listen med favoritter
      favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    });

    // Legg til en event listener på hvert kort
    card.addEventListener("click", (event) => {
      // Fjern klassen 'full-card' fra alle kort
      document.querySelectorAll(".card.full-card").forEach((otherCard) => {
        otherCard.classList.remove("full-card");
      });

      // Legg til klassen 'full-card' til dette kortet
      card.classList.add("full-card");

      // Forhindre at eventet bobler opp til document
      event.stopPropagation();
    });

    // Legg til en event listener på document som fjerner 'full-card' klassen fra alle kort når det klikkes utenfor kortene
    document.addEventListener("click", () => {
      document.querySelectorAll(".card.full-card").forEach((card) => {
        card.classList.remove("full-card");
      });
    });

    userCardContainer.append(card);
  });
}
// Kall fetchMovies funksjonen når siden lastes
fetchMovies();

searchInput.addEventListener("input", (e) => {
  if (favouriteCheckbox.checked) {
    searchMovies(e.target.value, true);
  } else {
    searchMovies(e.target.value);
  }
});

favouriteCheckbox.addEventListener("change", (event) => {
  if (event.target.checked) {
    searchMovies(searchInput.value, true);
  } else {
    searchMovies(searchInput.value);
  }
});

// Last inn lastInnStart antall filmer når siden lastes
document.addEventListener("DOMContentLoaded", () => {
  searchMovies("");
});
