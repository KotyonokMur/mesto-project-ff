//Строгий режим
'use strict';

import '../pages/index.css';//Подключение главного файла стилей.]
import { initialCards } from './cards.js';

// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const content = document.querySelector('.places');
const cardList = content.querySelector('.places__list');

// @todo: Функция удаления карточки
function deleteCard(event) {
  const deleteItem = event.target.closest('.card');
  deleteItem.remove();
}

// @todo: Функция создания карточки
function createCard(name, link, deleteCallback) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardElement.querySelector('.card__title').textContent = name;
  cardElement.querySelector('.card__image').src = link;
  cardElement.querySelector('.card__image').alt = 'Изображение ' + name;

  deleteButton.addEventListener('click', deleteCallback);

  return cardElement;
}

// @todo: Вывести карточки на страницу
initialCards.forEach(item => {
  const cardElement = createCard(item.name, item.link, deleteCard);
  cardList.append(cardElement);
});

