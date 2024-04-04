"use strict"; // Строгий режим

import "../pages/index.css"; // Подключение главного файла стилей.
//import { initialCards } from "./cards.js"; // Карточки по-умолчанию
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

// Элемент настроек валидации
const validationConfig = {
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Base logic
// Добавить слушатель на кнопку edit profile
editButton.addEventListener("click", () => {
  editModalFunction(editModal);
});

// Добавить слушатель на кнопку add
newCardButton.addEventListener("click", () => {
  openModal(newCardModal);
});

// Добавить слушатель на кнопку edit image

newImageButton.addEventListener("click", () => {
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
  .addEventListener("submit", newImageHandler);

// Поведение попапа изменения профиля (edit)
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
function newImageHandler(event) {
  //Убираем стандартное поведение
  event.preventDefault();

  renderLoadingForm(true, newImageModal.querySelector(".popup__button"));
  postNewAvatar(newImageModalInput.value)
    .then((res) => {
      avatarImage.style.backgroundImage = `url(${res.avatar})`;
      // Очищаем поля формы с помощью метода reset()
      newImageFormElement.reset();
      /* "Используйте функцию clearValidation
          при очистке формы добавления карточки." */
      clearValidation(event.target, validationConfig);
    })
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    })
    .finally(() =>{
      closeModal(newImageModal);
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
    })
    .catch((error) => {
      // Вывод сообщения об ошибке в консоль
      console.log(`Ошибка: ${error.message}`);
    })
    .finally(() => {
      //Закрываем окно
      closeModal(editModal);
      renderLoadingForm(false, editModal.querySelector(".popup__button"));
    });
}

// Обработчик new button
function newCardFormHandler(event) {
  // убираем стандартное поведение
  event.preventDefault();
  renderLoadingForm(true, newCardModal.querySelector(".popup__button"));
  // Получаем user._id и создаем карточку
  getUserData()
    .then((user) => {
      // Имя и ссылка на картинку новой карточки
      const newCard = {
        name: newCardNameInput.value,
        link: newCardUrlInput.value,
      };

      postNewCard(newCard)
        .then((res) => {
          // Добавляем новую карточку в список
          const cardElement = createCard(
            user._id,
            res,
            deleteCard,
            likeCard,
            openCard
          );

          // Добавление карточки в DOM
          cardList.prepend(cardElement);

          // Очищаем поля формы с помощью метода reset()
          newCardFormElement.reset();
          /* "Используйте функцию clearValidation
    при очистке формы добавления карточки." */
          clearValidation(event.target, validationConfig);
        })
        // Не получилось запостить новую карточку
        .catch((error) => {
          console.log(`Ошибка: ${error.message}`);
        })
        .finally(() => {
          // Закрываем модальное окно
          closeModal(newCardModal);
          renderLoadingForm(false, newCardModal.querySelector(".popup__button"));
        });
    })
    // Не получилось загрузить данные пользователя
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
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
    /*
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });*/
    setEventListeners(formElement, settings);
  });
};

// Ждём пока загрузится DOM
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

//--------------------------------spr7_api-integration--------------------------------

import {
  getCardsFromServer,
  getUserData,
  editUserData,
  postNewCard,
  postNewAvatar,
} from "./api.js";

// Анимация загрузки ответа от сервера на кнопках "Сохранить" в модальных окнах
function renderLoadingForm(isLoading, popupButton) {
  if (isLoading) {
    popupButton.textContent = "Сохранение...";
  } else {
    popupButton.textContent = "Сохранить";
  }
}

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
    renderCardsFromServer(data, user._id);
    //Подтянуть и обработать настройки пользователя с сервера
    renderUserFromServer(user);
  })
  .catch((error) => {
    // Вывод сообщения об ошибке в консоль
    console.log(`Ошибка: ${error.message}`);
  });