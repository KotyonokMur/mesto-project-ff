"use strict"; // Строгий режим

// @todo: DOM узлы
// Темлпейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// Функция удаления карточки
export function deleteCard(event) {
  const deleteItem = event.target.closest(".card");
  deleteItem.remove();
}

// Функция лайка карточки
export function likeCard(event) {
  // Переключаем класс card__like-button_is-active
  event.currentTarget.classList.toggle("card__like-button_is-active");
}

// Функция создания карточки
export function createCard(
  name,
  link,
  deleteCallback,
  likeCallBack,
  openCallback
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardElement.querySelector(".card__title").textContent = name;
  cardElement.querySelector(".card__image").src = link;
  cardElement.querySelector(".card__image").alt = "Изображение " + name;

  likeButton.addEventListener("click", likeCallBack);
  deleteButton.addEventListener("click", deleteCallback);
  cardElement.addEventListener("click", openCallback);

  return cardElement;
}
