"use strict"; // Строгий режим

import "../pages/index.css"; // Подключение главного файла стилей.
import { initialCards } from "./cards.js"; // Карточки по-умолчанию
import { deleteCard, createCard, likeCard } from "./card.js"; // Функции карточек
import { openModal, closeModal } from "./modal.js"; // Функции модальных окон
import { hideInputError, setEventListeners } from "./validation.js"; // Валидация модальных окон

// DOM Для карточек
const content = document.querySelector(".places");
const cardList = content.querySelector(".places__list");

// DOM Для edit button
const editButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector(".popup_type_edit");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const newProfileNameInput = editModal.querySelector(".popup__input_type_name");
const newProfileDescriptionInput = editModal.querySelector(
  ".popup__input_type_description"
);
// Подтягиваем фактическое имя/описание профиля
newProfileNameInput.value = profileTitle.textContent;
newProfileDescriptionInput.value = profileDescription.textContent;

// DOM Для add button
const newCardButton = document.querySelector(".profile__add-button");
const newCardModal = document.querySelector(".popup_type_new-card");
const newCardNameInput = newCardModal.querySelector(
  ".popup__input_type_card-name"
);
const newCardUrlInput = newCardModal.querySelector(".popup__input_type_url");

// DOM для открытия карточек
const cardModal = document.querySelector(".popup_type_image");
const imageElement = cardModal.querySelector(".popup__image");
const captionElement = cardModal.querySelector(".popup__caption");

// DOM Для очистки формы
const formElement = newCardModal.querySelector(".popup__form");

// Элемент настроек валидации
const validationConfig = {
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Base logic
// Добавить слушатель на кнопку edit
editButton.addEventListener("click", () => {
  editModalFunction(editModal);
});

// Добавить слушатель на кнопку add
newCardButton.addEventListener("click", () => {
  openModal(newCardModal);
});

// Вывести карточки на страницу
initialCards.forEach((item) => {
  const cardElement = createCard(
    item.name,
    item.link,
    deleteCard,
    likeCard,
    openCard
  );
  cardList.append(cardElement);
});

// Добавить обработчик события submit для формы new card в модальном окне
newCardModal
  .querySelector(".popup__form")
  .addEventListener("submit", newCardFormHandler);

// Добавить обработчик события submit для формы edit в модальном окне
editModal
  .querySelector(".popup__form")
  .addEventListener("submit", editFormHandler);

// Поведение попапа изменения профиля (edit)--------------------------------!!!!!!!!!!!!!!!
function editModalFunction(modal) {
  // Подтягиваем фактическое имя/описание профиля
  newProfileNameInput.value = profileTitle.textContent;
  newProfileDescriptionInput.value = profileDescription.textContent;

  // Очищаем ошибки валидации формы и делаем кнопку неактивной
  clearValidation(modal.querySelector(".popup__form"), validationConfig);

  // Открываем модальное окно
  openModal(modal);
}

// Обработчики submit
// Обработчик edit button
function editFormHandler(event) {
  //Убираем стандартное поведение
  event.preventDefault();

  // Присваиваем новое имя/описание профилю
  const newName = newProfileNameInput.value;
  const newDescription = newProfileDescriptionInput.value;

  profileTitle.textContent = newName;
  profileDescription.textContent = newDescription;

  //Закрываем окно
  closeModal(editModal);
}

// Обработчик new button
function newCardFormHandler(event) {
  // убираем стандартное поведение
  event.preventDefault();

  // Имя и ссылка на картинку новой карточки
  const placeName = newCardNameInput.value;
  const placeUrl = newCardUrlInput.value;

  // Создаем новую карточку
  const newCard = createCard(
    placeName,
    placeUrl,
    deleteCard,
    likeCard,
    openCard
  );

  // Добавляем новую карточку в список
  cardList.prepend(newCard);

  // Очищаем поля формы с помощью метода reset()
  formElement.reset();
  /* "Используйте функцию clearValidation
  при очистке формы добавления карточки." */
  clearValidation(event.target, validationConfig);

  // Закрываем модальное окно
  closeModal(newCardModal);
}

// Функция открытия карточки
function openCard(event) {
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

  // Присваиваем значения карточки значению попапа
  imageElement.src = link;
  imageElement.alt = caption;
  captionElement.textContent = caption;

  // Открытие попапа карточки
  openModal(cardModal);
}

// Очистка ошибок валидации и сделать кнопку неактивной
const clearValidation = (formElement, settings) => {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });

  buttonElement.disabled = true;
  buttonElement.classList.add(settings.inactiveButtonClass);
};

// Включение валидации всех форм
const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault(); //(!) Возможно это нужно будет убрать т.к. уже есть в функциях модальных окон
    });
    //console.log(formElement); del (всё так, выводит два окна)
    setEventListeners(formElement, settings);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // Вызываем функцию enableValidation с передачей объекта настроек
  enableValidation({
    formSelector: ".popup__form",
    inputSelector: ".popup__input",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "button_inactive",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible",
  });
});