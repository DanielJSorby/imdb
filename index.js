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

        // Oppdater knappens tekst når kortet blir laget
        let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
        let exists = favourites.some(
          (favMovie) => favMovie.title === movie.title
        );
        favouriteButton.textContent = exists
          ? "Remove from favourites"
          : "Add to favourites";

        favouriteButton.addEventListener("click", () => {
          // Sjekk om filmen allerede finnes i favorittlisten
          exists = favourites.some(
            (favMovie) => favMovie.title === movie.title
          );

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

          // Oppdater knappens tekst etter at favorittlisten er oppdatert
          favouriteButton.textContent = exists
            ? "Add to favourites"
            : "Remove from favourites";
        });

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
