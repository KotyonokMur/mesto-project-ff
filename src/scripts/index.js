"use strict"; // Строгий режим

import "../pages/index.css"; // Подключение главного файла стилей.
import { renderLoadingForm } from "./utils.js";
import { deleteCard, createCard, likeCard } from "./card.js"; // Функции карточек
import { openModal, closeModal } from "./modal.js"; // Функции модальных окон
import { clearValidation, enableValidation } from "./validation.js"; // Валидация модальных окон
import {
  // api
  getCardsFromServer,
  getUserData,
  editUserData,
  postNewCard,
  postNewAvatar,
} from "./api.js";

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

// DOM Для add button
const newCardButton = document.querySelector(".profile__add-button");
const newCardModal = document.querySelector(".popup_type_new-card");
const newCardNameInput = newCardModal.querySelector(
  ".popup__input_type_card-name"
);
const newCardUrlInput = newCardModal.querySelector(".popup__input_type_url");
const newCardFormElement = newCardModal.querySelector(".popup__form");

// DOM для открытия карточек
const cardModal = document.querySelector(".popup_type_image");
const imageElement = cardModal.querySelector(".popup__image");
const captionElement = cardModal.querySelector(".popup__caption");

// DOM для edit image button
const avatarImage = document.querySelector(".profile__image");
const newImageModal = document.querySelector(".popup_type_new-image");
const newImageModalInput = newImageModal.querySelector(
  ".popup__input_type_url"
);
const newImageButton = document.querySelector(".profile__image-edit-button");
const newImageFormElement = newImageModal.querySelector(".popup__form");

// DOM для delete button
/*
Дополнительно. Попап удаления карточки
Это дополнительное задание — выполнять его не обязательно. (!)
(Пока решил не выполнять)
*/

// ID пользователя
let userId;

// Элемент настроек валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Base logic
// Добавить слушатель на кнопку edit profile
editButton.addEventListener("click", () => {
  clearValidation(editModal, validationConfig);
  editModalFunction(editModal);
});

// Добавить слушатель на кнопку add
newCardButton.addEventListener("click", () => {
  clearValidation(newCardModal, validationConfig);
  openModal(newCardModal);
});

// Добавить слушатель на кнопку edit image

newImageButton.addEventListener("click", () => {
  /* "Используйте функцию clearValidation
          при очистке формы добавления карточки." */
  clearValidation(newImageModal, validationConfig);
  openModal(newImageModal);
});

// Добавить обработчик события submit для формы new card в модальном окне
newCardModal
  .querySelector(".popup__form")
  .addEventListener("submit", newCardFormHandler);

// Добавить обработчик события submit для формы edit в модальном окне
editModal
  .querySelector(".popup__form")
  .addEventListener("submit", editFormHandler);

// Добавить обработчик события submit для формы new image в модальном окне
newImageModal
  .querySelector(".popup__form")
  .addEventListener("submit", submitEditAvatarForm);

// Поведение попапа изменения профиля (edit)
function editModalFunction(modal) {
  // Подтягиваем фактическое имя/описание профиля
  newProfileNameInput.value = profileTitle.textContent;
  newProfileDescriptionInput.value = profileDescription.textContent;

  // Открываем модальное окно
  openModal(modal);
}

// Обработчики submit
function submitEditAvatarForm(event) {
  //Убираем стандартное поведение
  event.preventDefault();

  renderLoadingForm(true, newImageModal.querySelector(".popup__button"));
  postNewAvatar(newImageModalInput.value)
    .then((res) => {
      avatarImage.style.backgroundImage = `url(${res.avatar})`;
      // Очищаем поля формы с помощью метода reset()
      newImageFormElement.reset();
      closeModal(newImageModal);
    })
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    })
    .finally(() => {
      renderLoadingForm(false, newImageModal.querySelector(".popup__button"));
    });
}

// Обработчик edit button
function editFormHandler(event) {
  //Убираем стандартное поведение
  event.preventDefault();
  renderLoadingForm(true, editModal.querySelector(".popup__button"));
  // Присваиваем новое имя/описание профилю
  const newName = newProfileNameInput.value;
  const newDescription = newProfileDescriptionInput.value;

  //Изменяем настройки на сервере
  editUserData(newName, newDescription)
    .then((res) => {
      // Если запрос прошел успешно, присваиваем профилю новое имя
      profileTitle.textContent = res.name;
      profileDescription.textContent = res.about;
      closeModal(editModal);
    })
    .catch((error) => {
      // Вывод сообщения об ошибке в консоль
      console.log(`Ошибка: ${error.message}`);
    })
    .finally(() => {
      //Закрываем окно
      renderLoadingForm(false, editModal.querySelector(".popup__button"));
    });
}

// Обработчик new button
function newCardFormHandler(event) {
  // убираем стандартное поведение
  event.preventDefault();
  renderLoadingForm(true, newCardModal.querySelector(".popup__button"));
  // Имя и ссылка на картинку новой карточки
  const newCard = {
    name: newCardNameInput.value,
    link: newCardUrlInput.value,
  };

  postNewCard(newCard)
    .then((res) => {
      // Добавляем новую карточку в список
      const cardElement = createCard(
        userId,
        res,
        deleteCard,
        likeCard,
        openCard
      );

      // Добавление карточки в DOM
      cardList.prepend(cardElement);

      // Очищаем поля формы с помощью метода reset()
      newCardFormElement.reset();

      // Закрываем модальное окно
      closeModal(newCardModal);
    })
    // Не получилось запостить новую карточку
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    })
    .finally(() => {
      renderLoadingForm(false, newCardModal.querySelector(".popup__button"));
    });
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

//--------------------------------spr7_validation--------------------------------

// Ждём пока загрузится DOM
document.addEventListener("DOMContentLoaded", () => {
  // Вызываем функцию enableValidation с передачей объекта настроек
  enableValidation(validationConfig);
});

//--------------------------------spr7_api-integration--------------------------------

// Обработка карточек с сервера
function renderCardsFromServer(data, userId) {
  data.forEach((item) => {
    const cardElement = createCard(
      userId,
      item,
      deleteCard,
      likeCard,
      openCard
    );
    // Добавление карточки в DOM
    cardList.append(cardElement);
  });
}

// Обработка профиля с сервера
function renderUserFromServer(user) {
  avatarImage.style.backgroundImage = `url(${user.avatar})`;
  profileTitle.textContent = user.name;
  profileDescription.textContent = user.about;
}

// Базовая логика подгрузки информации о карточках и пользователе с сервера
Promise.all([getCardsFromServer(), getUserData()])
  .then(([data, user]) => {
    // Подтянуть и обработать карточки с сервера
    userId = user._id;
    renderCardsFromServer(data, user._id);
    //Подтянуть и обработать настройки пользователя с сервера
    renderUserFromServer(user);
  })
  .catch((error) => {
    // Вывод сообщения об ошибке в консоль
    console.log(`Ошибка: ${error.message}`);
  });
