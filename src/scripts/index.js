"use strict"; // Строгий режим

import "../pages/index.css"; // Подключение главного файла стилей.
import { initialCards } from "./cards.js"; // Карточки по-умолчанию
import { deleteCard, createCard, likeCard, openCard } from "./card.js"; // Функции карточек
import { openModal, closeModal } from "./modal.js";

// DOM Для карточек
const content = document.querySelector(".places");
const cardList = content.querySelector(".places__list");

// DOM Для edit button
const editButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector(".popup_type_edit");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const newProfileNameInput = editModal.querySelector(".popup__input_type_name");
const newProfileDescriptionInput = editModal.querySelector(".popup__input_type_description");

// DOM Для add button
const newCardButton = document.querySelector(".profile__add-button");
const newCardModal = document.querySelector(".popup_type_new-card");
const newCardNameInput = newCardModal.querySelector(".popup__input_type_card-name");
const newCardUrlInput = newCardModal.querySelector(".popup__input_type_url");

// DOM Для очистки формы
const formElement = newCardModal.querySelector(".popup__form");

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
newCardModal.querySelector(".popup__form").addEventListener("submit", newCardFormHandler);

// Добавить обработчик события submit для формы edit в модальном окне
editModal.querySelector(".popup__form").addEventListener("submit", editFormHandler);

// Поведение попапа изменения профиля (edit)
function editModalFunction(modal) {
  // Подтягиваем фактическое имя/описание профиля
  newProfileNameInput.value = profileTitle.textContent;
  newProfileDescriptionInput.value = profileDescription.textContent;

  // Открываем модальное окно
  openModal(modal);
}

// Обработчики submit
// Обработчик edit button
function editFormHandler(event) {
  //Убираем стандартное поведение
  event.preventDefault();

  // Получаем форму, которая вызвала событие submit
  const form = event.currentTarget; 

  // Получаем элементы из формы
  const newProfileNameInput = form.querySelector(".popup__input_type_name"); 
  const newProfileDescriptionInput = form.querySelector(".popup__input_type_description");

  // Присваиваем новое имя/описание профилю
  const newName = newProfileNameInput.value;
  const newDescription = newProfileDescriptionInput.value;

  profileTitle.textContent = newName;
  profileDescription.textContent = newDescription;

  //Закрываем окно
  closeModal(editModal);
}

// Обработчик new button
export function newCardFormHandler(event) {
  // убираем стандартное поведение
  event.preventDefault();

  // Имя и ссылка на картинку новой карточки
  const placeName = newCardNameInput.value;
  const placeUrl = newCardUrlInput.value;

  // Создаем новую карточку
  const newCard = createCard(placeName, placeUrl, deleteCard, likeCard, openCard);

  // Добавляем новую карточку в список
  cardList.prepend(newCard);

  // Очищаем поля формы с помощью метода reset()
  formElement.reset();

  // Закрываем модальное окно
  closeModal(newCardModal);
}

//Обработчики закрытия попапов:
// Закрытие через оверлей
export function handleOverlayClick(event) {
  const modal = event.currentTarget;
  if (event.target === modal) {
    //Если нажали на оверлей, значит нажали на .popup => закрываем
    closeModal(modal);
  }
}

// Закрытие через кнопку крестика
export function handleCloseButtonClick(event) {
  //Ищет ближайший попап к кнопке и закрывает его
  const modal = event.target.closest(".popup");
  closeModal(modal);
}

// Закрытие через Esc
export function handleKeyDown(event) {
  //Ищет открытый попап и закрывает его
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".popup_is-opened");
    closeModal(openedModal);
  }
}
