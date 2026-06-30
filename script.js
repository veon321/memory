const buttonAddElement = document.getElementById("addElement");
const container = document.getElementById("container");
const timeRound = document.getElementById("time");
const score = document.getElementById("score");
const clickSound = new Audio("assets/sounds/click.mp3");
const success = new Audio("assets/sounds/success.mp3");
const playAgain = document.getElementById("play-again");

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
let timeToEndRound = 500;
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

  clickSound.currentTime = 0;
  clickSound.play();
  clickSound.volume = 0.2;

  timeToEndRoundInterval = setInterval(() => {
    if (timeToEndRound <= 1) {
      clearInterval(timeToEndRoundInterval);
      click = 0;
      card.classList.remove("revealed");
      timeToEndRound = 500 + 100;
    }
    timeToEndRound -= 1;
    timeRound.innerHTML = `${(timeToEndRound / 100).toFixed(2)}s`;
  }, 10);

  if (!card) return;
  card.classList.add("revealed");
  if (click == 0) {
    timeToEndRound = 500;
    click1 = card;
    click = 1;
  } else if (click === 1) {
    // para
    if (card.alt === click1.alt) {
      click = 0;
      clearInterval(timeToEndRoundInterval);
      currentScore += 5 + timeToEndRound;
      score.innerHTML = `Score: ${currentScore}`;
      timeToEndRound = 500;
      timeRound.innerHTML = `${(timeToEndRound / 100).toFixed(2)}s`;
      success.currentTime = 0;
      success.play();
      success.volume = 0.4;
    } else {
      // pudlo
      isLocked = true;
      clearInterval(timeToEndRoundInterval);
      timeToEndRound = 500;
      timeRound.innerHTML = `${(timeToEndRound / 100).toFixed(2)}s`;
      setTimeout(() => {
        card.classList.remove("revealed");
        click1.classList.remove("revealed");
        click = 0;
        isLocked = false;
      }, 1500);
    }
    const cards = container.querySelectorAll(".card-container img");

    const isGameOver = Array.from(cards).every((card) =>
      card.classList.contains("revealed"),
    );

    if (isGameOver) {
      playAgain.style.display = "block";
    }
  }
});

function resetGame() {
  const cards = container.querySelectorAll(".card-container img");

  cards.forEach((card) => {
    card.classList.remove("revealed");
  });

  playAgain.style.display = "none";

  currentScore = 0;
  score.innerHTML = `Score: 0`;
}
playAgain.addEventListener("click", resetGame);
