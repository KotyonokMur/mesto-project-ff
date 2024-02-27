// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const content = document.querySelector(".places");
const cardList = content.querySelector(".places__list");

// @todo: Функция удаления карточки
function deleteCard(event) {
  const deleteItem = event.target.closest(".card");
  
  deleteItem.remove();
}

// @todo: Функция создания карточки
function createCard(name, link) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardElement.querySelector(".card__title").textContent = name;
  cardElement.querySelector(".card__image").src = link;

  deleteButton.addEventListener("click", deleteCard);

  return cardElement;
}

// @todo: Вывести карточки на страницу
for (let i = 0; i < initialCards.length; i = i + 1){
  cardElement = createCard(initialCards[i].name, initialCards[i].link);
 
  cardList.append(cardElement);
}
