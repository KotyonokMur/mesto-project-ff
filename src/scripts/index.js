"use strict"; // Строгий режим

import "../pages/index.css"; // Подключение главного файла стилей.]
import { initialCards, createCard, deleteCard, consolelog } from "./cards.js"; // Импорт функций карточек

// @todo: DOM узлы
const content = document.querySelector(".places");
const cardList = content.querySelector(".places__list");

// @todo: Вывести карточки на страницу
initialCards.forEach((item) => {
  const cardElement = createCard(item.name, item.link, deleteCard);
  cardList.append(cardElement);
});