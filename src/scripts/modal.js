"use strict"; // Строгий режим

import {
  handleOverlayClick,
  handleCloseButtonClick,
  handleKeyDown,
} from "./index.js";

// Закрыть модальное окно
export function closeModal(modal) {
  // Добавление класса "попап анимированный"
  modal.classList.add("popup_is-animated");

  // Удаление класса "попап открыт"
  modal.classList.remove("popup_is-opened");

  // Удаление слушателей закрытия попапа
  modal.removeEventListener("click", handleOverlayClick);
  document.removeEventListener("keydown", handleKeyDown);
  modal
    .querySelector(".popup__close")
    .removeEventListener("click", handleCloseButtonClick);

  // Удаление анимации после её завершения
  setTimeout(function () {
    modal.classList.remove("popup_is-animated");
  }, 600); // Задержка анимации, в миллисекундах
}

export function openModal(modal) {
  //Добавление анимации
  modal.classList.add("popup_is-animated");

  // Открытие попапа после добавление анимации
  setTimeout(function () {
    modal.classList.add("popup_is-opened");
  }, 1); // Задержка анимации, в миллисекундах

  // Накладываем слушатели на закрытие попапа
  modal.addEventListener("click", handleOverlayClick);
  document.addEventListener("keydown", handleKeyDown);
  modal
    .querySelector(".popup__close")
    .addEventListener("click", handleCloseButtonClick);
}
