const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");
const searchInput = document.querySelector("[data-search]");

let users = [];

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  users.forEach((user) => {
    const isVisible =
      user.title.toLowerCase().includes(value) ||
      user.year.toLowerCase().includes(value);
    user.element.classList.toggle("hide", !isVisible);
  });
});

fetch(
  "https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json"
)
  .then((res) => res.json())
  .then((data) => {
    users = data.map((user) => {
      const card = userCardTemplate.content.cloneNode(true).children[0];
      const header = card.querySelector("[data-header]");
      const body = card.querySelector("[data-body]");
      header.textContent = user.title;
      body.textContent = user.year;
      userCardContainer.append(card);
      console.log(card);
      return { name: user.title, email: user.year, element: card };
    });
  });
