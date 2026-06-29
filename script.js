const buttonAddElement = document.getElementById("addElement");
const container = document.getElementById("container");
const timeRound = document.getElementById("time");
const score = document.getElementById("score");

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

let click = 0;
let click1 = "";
let timeToEndRound = 5;
let timeToEndRoundInterval = null;
let isLocked = false;
let currentScore = 0;

container.addEventListener("click", (event) => {
  if (isLocked) return;
  const clickedCard = event.target.closest(".card-container");
  const card = clickedCard.querySelector("img");

  if (card.classList.contains("revealed")) {
    return;
  }

  if (timeToEndRoundInterval) clearInterval(timeToEndRoundInterval);

  timeToEndRoundInterval = setInterval(() => {
    if (timeToEndRound <= 1) {
      clearInterval(timeToEndRoundInterval);
      click = 0;
      card.classList.remove("revealed");
      timeToEndRound = 5 + 1;
    }
    timeToEndRound -= 1;
    timeRound.innerHTML = `${timeToEndRound}s`;
  }, 1000);

  console.log(card);

  if (!card) return;
  card.classList.add("revealed");
  if (click == 0) {
    timeToEndRound = 5;
    click1 = card;
    click = 1;
  } else if (click === 1) {
    // para
    if (card.alt === click1.alt) {
      click = 0;
      clearInterval(timeToEndRoundInterval);
      currentScore += 5 + timeToEndRound;
      score.innerHTML = `Score: ${currentScore}`;
      timeToEndRound = 5;
      timeRound.innerHTML = `${timeToEndRound}s`;
    } else {
      // pudlo
      isLocked = true;
      clearInterval(timeToEndRoundInterval);
      timeToEndRound = 5;
      timeRound.innerHTML = `${timeToEndRound}s`;
      setTimeout(() => {
        card.classList.remove("revealed");
        click1.classList.remove("revealed");
        click = 0;
        isLocked = false;
      }, 1500);
    }
  }
});
