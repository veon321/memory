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
    newElement.classList.add("card");
    const imgElement = document.createElement("img");
    imgElement.src = card.image;
    imgElement.alt = card.name;
    newElement.appendChild(imgElement);
    container.appendChild(newElement);
  });
}

container.addEventListener("click", (event) => {
  const clickedCard = event.target.closest(".card");
  if (!clickedCard) return;
  console.log("Kliknięto w kartę:", clickedCard);
  clickedCard.classList.add("revealed");
});
