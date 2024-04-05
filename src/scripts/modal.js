"use strict"; // Строгий режим

// Закрыть модальное окно
export function closeModal(modal) {
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

// Открыть модальное окно
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

//Обработчики закрытия попапов:
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
