"use strict"; // Строгий режим

import { openModal } from "./modal.js";

// @todo: DOM узлы
// Темлпейт карточки
const cardTemplate = document.querySelector("#card-template").content;
// Модальное окно для открытия карточки
const cardModal = document.querySelector(".popup_type_image");

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

// Функция открытия карточки
export function openCard(event) {
  // Прерываем выполнение функции, если было нажатие на кнопку лайка или удаления
  if (
    event.target.classList.contains("card__like-button") ||
    event.target.classList.contains("card__delete-button")
  ) {
    return;
  }

  // Получаем ссылку на изображение и подпись из атрибутов карточки
  const link = event.currentTarget.querySelector(".card__image").src;
  const caption = event.currentTarget.querySelector(".card__title").textContent;

  // Устанавливаем ссылку на изображение и подпись в попапе
  const imageElement = cardModal.querySelector(".popup__image");
  const captionElement = cardModal.querySelector(".popup__caption");

  // Присваиваем значения карточки значению попапа
  imageElement.src = link;
  imageElement.alt = caption;
  captionElement.textContent = caption;

  // Открытие попапа карточки
  openModal(cardModal);
}

// Функция создания карточки
export function createCard(name, link, deleteCallback, likeCallBack, openCallback) {
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
