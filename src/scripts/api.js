// group-id: wff-cohort-10
// token: e6d0b345-bf5b-4312-9c8a-79d263ca3000
// site: https://nomoreparties.co/v1/wff-cohort-10/cards

// cfg для отправки запросов
export const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-10",
  headers: {
    authorization: "e6d0b345-bf5b-4312-9c8a-79d263ca3000",
    "Content-Type": "application/json",
  },
};

// Обработка ответа от сервера
export const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Ошибка: неверный статус ответа сервера (handleResponse)");
  }
};

// Получение карточек от сервера
export const getCardsFromServer = () => {
  return fetch(config.baseUrl + "/cards", {
    headers: {
      authorization: config.headers.authorization,
    },
  }).then(handleResponse);
};

// Получение данных пользователя с сервера
export const getUserData = () => {
  return fetch(config.baseUrl + "/users/me", {
    headers: {
      authorization: config.headers.authorization,
    },
  }).then(handleResponse);
};

// Запрос на изменение данных пользователя
export const editUserData = (newName, newDescription) => {
  return fetch(config.baseUrl + "/users/me", {
    method: "PATCH",
    headers: {
      authorization: config.headers.authorization,
      "Content-Type": config.headers["Content-Type"],
    },
    body: JSON.stringify({
      name: newName,
      about: newDescription,
    }),
  }).then(handleResponse);
};

// Запостить новую карточку
export const postNewCard = (newCard) => {
  return fetch(config.baseUrl + "/cards", {
    method: "POST",
    headers: {
      authorization: config.headers.authorization,
      "Content-Type": config.headers["Content-Type"],
    },
    body: JSON.stringify({
      name: newCard.name,
      link: newCard.link,
    }),
  }).then(handleResponse);
};

// Удалить карточку из сервера
export const deleteCardFromServer = (card) => {
  return fetch(config.baseUrl + "/cards/" + card._id, {
    method: "DELETE",
    headers: {
      authorization: config.headers.authorization,
    },
  }).then(handleResponse);
};

// Поставить лайк карточке на сервере
export const likeCardOnServer = (card) => {
  // Хз откуда взять card._id после публикации карты
  // Возможно, от сервака ответ приходит
  return fetch(config.baseUrl + "/cards/likes/" + card._id, {
    method: "PUT",
    headers: {
      authorization: config.headers.authorization,
    },
  }).then(handleResponse);
};

// Убрать лайк карточке на сервере
export const dislikeCardOnServer = (card) => {
  return fetch(config.baseUrl + "/cards/likes/" + card._id, {
    method: "DELETE",
    headers: {
      authorization: config.headers.authorization,
    },
  }).then(handleResponse);
};

// Обновить аватарку профиля
export const postNewAvatar = (url) => {
  return fetch(config.baseUrl + "/users/me/avatar", {
    method: "PATCH",
    headers: {
      authorization: config.headers.authorization,
      "Content-Type": config.headers["Content-Type"],
    },
    body: JSON.stringify({
      avatar: url,
    }),
  }).then(handleResponse);
};
