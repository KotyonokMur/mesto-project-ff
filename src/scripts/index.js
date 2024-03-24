"use strict"; // Строгий режим

import "../pages/index.css"; // Подключение главного файла стилей.]
import {
  initialCards,
  createCard,
  deleteCard,
  handleLikeButtonClick,
} from "./cards.js"; // Импорт функций карточек
import {
  //OpenModal - вызывается внутри методов открытия того или иного попапа
  //Необходимости импортировать его в этот файл - нет
  closeModal,
  CardModalFunction,
  editModalFunction,
  newCardModalFunction,
} from "./modal.js";

// @todo: DOM узлы
// Для карточек
const content = document.querySelector(".places");
const cardList = content.querySelector(".places__list");
export const cardTemplate = document.querySelector("#card-template").content;
// Для модальных окон
const editButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector(".popup_type_edit");
const newCardButton = document.querySelector(".profile__add-button");
const newCardModal = document.querySelector(".popup_type_new-card");
const cardModal = document.querySelector(".popup_type_image");

//Карточки:
// @todo: Вывести карточки на страницу
initialCards.forEach((item) => {
  const cardElement = createCard(item.name, item.link, deleteCard);
  cardList.append(cardElement);
  handleCardOpener(cardElement);
});

//Модальные окна:
// Наложение слушателей на открытия форм:
// Они внутри себя вызывают функцию openModal

// кнопка: "изменение профиля"
editButton.addEventListener("click", function () {
  editModalFunction(editModal);
});

// Кнопка: "новая карточка"
newCardButton.addEventListener("click", function () {
  newCardModalFunction(newCardModal);
});

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

// Формы и их поведение:

// Поведение формы изменения профиля
export function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const modal = evt.currentTarget.closest(".popup");

  const nameInputModal = modal.querySelector(".popup__input_type_name");
  const descriptionInputModal = modal.querySelector(
    ".popup__input_type_description"
  );

  const newName = nameInputModal.value;
  const newDescription = descriptionInputModal.value;

  const profileTitle = document.querySelector(".profile__title");
  const profileDescription = document.querySelector(".profile__description");

  profileTitle.textContent = newName;
  profileDescription.textContent = newDescription;

  closeModal(modal);
}

// Поведение формы добавления новой карточки
export function handleNewCardFormSubmit(evt, newCardmodal) {
  evt.preventDefault();

  // Получаем значения полей формы
  const placeNameInput = newCardmodal.querySelector(
    ".popup__input_type_card-name"
  );
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

// Обработчик открытия карточек
function handleCardOpener(cardButton) {
  const likeButton = cardButton.querySelector(".card__like-button");
  likeButton.addEventListener("click", handleLikeButtonClick);

  cardButton.addEventListener("click", function (event) {
    //Если мы нажали на кнопку лайка
    if (event.target.classList.contains("card__like-button")) {
      const likeButton =
        event.currentTarget.querySelector(".card__like-button");
      likeButton.addEventListener("click", handleLikeButtonClick);
    }
    //Если мы нажали на кнопку удаления
    else if (event.target.classList.contains("card__delete-button")) {
      //Тут всё делает deleteCallBack из функции создания карточек
      return;
    }
    //Если мы нажали на карточку в любом другом месте
    else {
      // Получаем ссылку на изображение и подпись
      const imageUrl = event.currentTarget.querySelector(".card__image").src;
      const caption =
        event.currentTarget.querySelector(".card__title").textContent;

      // Открываем попап с переданными данными
      CardModalFunction(cardModal, imageUrl, caption);
    }
  });
}
