const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");
const searchInput = document.querySelector("[data-search]");
const lastInnStart = 20;
// URL til JSON-filen
const url =
  "https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json";

// Funksjon for å søke gjennom filmene
function searchMovies(searchTerm) {
  // Henter JSON-data fra URL
  fetch(url)
    .then((response) => response.json())
    .then((movies) => {
      let result;
      if (searchTerm.trim() === "") {
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
        if (movie.thumbnail === "" || movie.thumbnail === undefined) {
          thumbnail.src = "./bilder/ingen-bilde.jpeg";
          thumbnail.alt = "Filmplakat ikke tilgjengelig";
        } else {
          thumbnail.src = movie.thumbnail;
          thumbnail.alt = movie.title;
        }

        header.textContent = movie.title;
        body.textContent = "Year: " + movie.year;
        userCardContainer.append(card);
      });
    })
    .catch((error) => console.error("Error:", error));
}

searchInput.addEventListener("input", (e) => {
  searchMovies(e.target.value);
});

// Last inn lastInnStart antall filmer når siden lastes
document.addEventListener("DOMContentLoaded", () => {
  searchMovies("");
});
