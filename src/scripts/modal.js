"use strict"; // Строгий режим

import {
  handleOverlayClick,
  handleCloseButtonClick,
  handleKeyDown,
  handleEditFormSubmit,
  handleNewCardFormSubmit,
} from "./index.js";

// Открыть модальное окно
export function openModal(modal) {
  // Добавление анимации открытия
  modal.classList.add("popup_is-animated");

  // Открытие попапа после добавление анимации
  setTimeout(function () {
    modal.classList.add("popup_is-opened");
  }, 1); // Задержка анимации, в миллисекундах

  // Добавление слушателей на разные сценарии закрытия попапа
  modal.addEventListener("click", handleOverlayClick);
  searchingCloseButton(modal).addEventListener("click", handleCloseButtonClick);
  document.addEventListener("keydown", handleKeyDown);
}

// Закрыть модальное окно
export function closeModal(modal) {
  // Добавление класса "попап анимированный"
  modal.classList.add("popup_is-animated");

  // Удаление класса "попап открыт"
  modal.classList.remove("popup_is-opened");

  // Удаление слушателей закрытия попапа
  modal.removeEventListener("click", handleOverlayClick);
  modal.removeEventListener("click", searchingCloseButton(modal));
  document.removeEventListener("keydown", handleKeyDown);

  // Если в модальном окне есть элемент с классом "popup__form", удаляем обработчик события submit с этого элемента
  const formElement = modal.querySelector(".popup__form");
  if (formElement && formElement.submitHandler) {
    formElement.removeEventListener("submit", formElement.submitHandler);
  }

  // Удаление класса "попап анимированный" после завершения анимации
  setTimeout(function () {
    modal.classList.remove("popup_is-animated");
  }, 600); // Задержка анимации, в миллисекундах
}

// Функция для открытия формы существующей карточки
export function CardModalFunction(cardModal, imageUrl, caption) {
  // Установка ссылки на изображение и подписи в попапе
  const imageElement = cardModal.querySelector(".popup__image");
  imageElement.src = imageUrl;

  const captionElement = cardModal.querySelector(".popup__caption");
  captionElement.textContent = caption;

  // Открытие попапа с переданными данными
  openModal(cardModal);
}

// Функции для открытия форм:

// Функция для открытия формы изменения профиля
export function editModalFunction(editModal) {
  const nameInput = editModal.querySelector(".popup__input_type_name");
  const descriptionInput = editModal.querySelector(
    ".popup__input_type_description"
  );

  const profileTitle = document.querySelector(".profile__title").textContent;
  const profileDescription = document.querySelector(
    ".profile__description"
  ).textContent;

  nameInput.value = profileTitle;
  descriptionInput.value = profileDescription;

  const formElement = editModal.querySelector(".popup__form");
  // Создаем анонимную функцию для обработки события submit
  const submitHandler = function (evt) {
    handleEditFormSubmit(evt);
  };
  
  // Добавляем обработчик события отправки формы
  formElement.addEventListener("submit", submitHandler);

  // Сохраняем ссылку на обработчик в объекте DOM, чтобы мы могли удалить его позже
  formElement.submitHandler = submitHandler;

  openModal(editModal);
}

// Функция для открытия формы добавления карточки
export function newCardModalFunction(newCardmodal) {
  // Находим форму для добавления новой карточки
  const formElement = newCardmodal.querySelector(".popup__form");

  // Создаем анонимную функцию для обработки события submit
  const submitHandler = function (evt) {
    handleNewCardFormSubmit(evt, newCardmodal);
  };

  // Добавляем обработчик события отправки формы
  formElement.addEventListener("submit", submitHandler);

  // Сохраняем ссылку на обработчик в объекте DOM, чтобы мы могли удалить его позже
  formElement.submitHandler = submitHandler;

  // Открываем модальное окно
  openModal(newCardmodal);
}

// Поиск кнопки закрытия модального окна
export function searchingCloseButton(modal) {
  return modal.querySelector(".popup__close");
}
