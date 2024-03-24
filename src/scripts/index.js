"use strict"; // Строгий режим

import "../pages/index.css"; // Подключение главного файла стилей.]
import { initialCards, createCard, deleteCard } from "./cards.js"; // Импорт функций карточек

// @todo: DOM узлы
const content = document.querySelector(".places");
const cardList = content.querySelector(".places__list");

// @todo: Вывести карточки на страницу
initialCards.forEach((item) => {
  const cardElement = createCard(item.name, item.link, deleteCard);
  cardList.append(cardElement);
});

//-----------------------------------файл modal.js

//DOM
const editButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector(".popup_type_edit");
const newCardButton = document.querySelector(".profile__add-button");
const newCardModal = document.querySelector(".popup_type_new-card");
const cardButtons = document.querySelectorAll(".card");
const cardModal = document.querySelector(".popup_type_image");

// Функции для открытия форм:

// Функция для открытия формы изменения профиля
function editModalFunction(editModal){
  
  const nameInput = editModal.querySelector(".popup__input_type_name");
  const descriptionInput = editModal.querySelector(".popup__input_type_description");

  const profileTitle = document.querySelector(".profile__title").textContent;
  const profileDescription = document.querySelector(".profile__description").textContent;
  
  nameInput.value = profileTitle;
  descriptionInput.value = profileDescription;

  const formElement = editModal.querySelector(".popup__form");
  formElement.addEventListener("submit", handleEditFormSubmit);

  openModal(editModal);
};

// Функция для открытия формы существующей карточки
function CardModalFunction(cardModal, imageUrl, caption) {
  // Установка ссылки на изображение и подписи в попапе
  const imageElement = cardModal.querySelector(".popup__image");
  imageElement.src = imageUrl;

  const captionElement = cardModal.querySelector(".popup__caption");
  captionElement.textContent = caption;

  // Открытие попапа с переданными данными
  openModal(cardModal);
}

// Функция для открытия формы добавления карточки
function newCardModalFunction(newCardmodal){
  // Открываем модальное окно
  openModal(newCardmodal);

  // Находим форму для добавления новой карточки
  const formElement = newCardmodal.querySelector(".popup__form");

  // Добавляем обработчик события отправки формы
  formElement.addEventListener("submit", function(evt) {
    handleNewCardFormSubmit(evt, newCardmodal);
  });
}

// Открыть модальное окно
function openModal(modal) {
  //Добавление класса "попап открыт"
  modal.classList.add("popup_is-opened");

  // Добавление слушателей на разные сценарии закрытия попапа
  modal.addEventListener("click", handleOverlayClick);
  searchingCloseButton(modal).addEventListener("click", handleCloseButtonClick);
  document.addEventListener("keydown", handleKeyDown);
};

// Наложение слушателей на открытия форм:

// кнопка: "изменение профиля"
editButton.addEventListener("click", function () {
  editModalFunction(editModal);
});

// Кнопка: "новая карточка"
newCardButton.addEventListener("click", function () {
  newCardModalFunction(newCardModal);
});

// Существующие карточки
cardButtons.forEach((cardButton) => {
  handleCardOpener(cardButton);
});

// Слушатели закрытия форм:

//Закрыть модальное окно
function closeModal(modal) {
  modal.classList.remove("popup_is-opened");
  modal.removeEventListener("click", handleOverlayClick);
  modal.removeEventListener("click", searchingCloseButton(modal));
  document.removeEventListener("keydown", handleKeyDown);
}

// Закрытие через оверлей
function handleOverlayClick(event) {
  const modal = event.currentTarget;
  if (event.target === modal) {
    //Если нажали на оверлей, значит нажали на .popup => закрываем
    closeModal(modal);
  }
}

// Закрытие через кнопку крестика
function handleCloseButtonClick(event) {
  //Ищет ближайший попап к кнопке и закрывает его
  const modal = event.target.closest(".popup");
  closeModal(modal);
}

// Закрытие через Esc
function handleKeyDown(event) {
  //Ищет открытый попап и закрывает его
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".popup_is-opened");
    closeModal(openedModal);
  }
}

// Формы и их поведение: 

// Поведение формы изменения профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const modal = evt.currentTarget.closest(".popup");

  const nameInputModal = modal.querySelector(".popup__input_type_name");
  const descriptionInputModal = modal.querySelector(".popup__input_type_description");

  const newName = nameInputModal.value;
  const newDescription = descriptionInputModal.value;

  const profileTitle = document.querySelector(".profile__title");
  const profileDescription = document.querySelector(".profile__description");

  profileTitle.textContent = newName;
  profileDescription.textContent = newDescription;

  closeModal(modal);
}

// Поведение формы добавления новой карточки
function handleNewCardFormSubmit(evt, newCardmodal){
  evt.preventDefault();

  // Получаем значения полей формы
  const placeNameInput = newCardmodal.querySelector(".popup__input_type_card-name");
  const placeLinkInput = newCardmodal.querySelector(".popup__input_type_url");
  const placeName = placeNameInput.value;
  const placeLink = placeLinkInput.value;

  // Создаем новую карточку
  const newCard = createCard(placeName, placeLink, deleteCard);

  // Добавляем новую карточку в список
  cardList.appendChild(newCard);

  // Добавляем слушатель на открытие карточки
  handleCardOpener(newCard);

  // Очищаем поля формы
  placeNameInput.value = "";
  placeLinkInput.value = "";

  // Закрываем модальное окно
  closeModal(newCardmodal);
}

// Вспомогательные функции, логика:

// Поиск кнопки закрытия модального окна
function searchingCloseButton(modal) {
  return modal.querySelector(".popup__close");
}

// Обработчик открытия карточек
function handleCardOpener(cardButton){
  cardButton.addEventListener("click", function (event) {
    // Проверка, что в событии нет кнопки удаления карточки.
    if (!event.target.classList.contains("card__delete-button")) {
      // Получаем ссылку на изображение и подпись
      const imageUrl = event.currentTarget.querySelector(".card__image").src;
      const caption = event.currentTarget.querySelector(".card__title").textContent;

      // Открываем попап с переданными данными
      CardModalFunction(cardModal, imageUrl, caption);
    }
  });
}
