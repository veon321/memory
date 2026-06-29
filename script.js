const buttonAddElement = document.getElementById("addElement");
const container = document.getElementById("container");

let cardsInGame = [];

function data() {
  fetch("/data/cards.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Błąd przy pobieraniu pliku!");
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((img) => {
        cardsInGame.push({
          image: img.image,
          name: img.name,
        });
        cardsInGame.push({
          image: img.image,
          name: img.name,
        });
      });
      cardsInGame.sort(() => Math.random() - 0.5);
      createCards();
    })

    .catch((error) => {
      console.error("Wystąpił problem: ", error);
    });
}
data();

function createCards() {
  cardsInGame.forEach((card) => {
    const newElement = document.createElement("div");
    newElement.classList.add("card-container");
    const imgElement = document.createElement("img");
    imgElement.src = card.image;
    imgElement.alt = card.name;
    imgElement.classList.add("card");
    newElement.appendChild(imgElement);
    container.appendChild(newElement);
  });
}

let klik = 0;
let klik1 = "nic";

container.addEventListener("click", (event) => {
  const clickedCard = event.target.closest(".card-container");
  const card = clickedCard.querySelector("img");

  console.log(card);

  if (!card) return;
  card.classList.add("revealed");
  if (klik == 0) {
    klik1 = card;
    klik = 1;
  } else if (klik === 1) {
    if (card.alt === klik1.alt) {
      console.log("para");
      klik = 0;
    } else {
      console.log("Pudło!");
      setTimeout(() => {
        card.classList.remove("revealed");
        klik1.classList.remove("revealed");
        klik = 0;
      }, 1500);
    }
  }
});
