"use strict";

// Показать ошибку ввода
export const showInputError = (
  formElement,
  inputElement,
  errorMessage,
  { inputErrorClass, errorClass }
) => {
  const errorElement = formElement.querySelector(
    `.${inputElement.name}-input-error`
  );
  inputElement.classList.add(inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(errorClass);
};

// Скрыть ошибку ввода
export const hideInputError = (
  formElement,
  inputElement,
  { inputErrorClass, errorClass }
) => {
  const errorElement = formElement.querySelector(
    `.${inputElement.name}-input-error`
  );
  inputElement.classList.remove(inputErrorClass);
  errorElement.classList.remove(errorClass);
  errorElement.textContent = "";
};

// Проверка валидности ввода
export const checkInputValidity = (formElement, inputElement, settings) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      settings
    );
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};

// Установка слушателей событий для полей ввода
export const setEventListeners = (formElement, settings) => {
  //.popup__input
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  //.popup__button
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );
  //Входит после первого инпута
  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

// Переключение состояния кнопки (активна/неактивна)
export const toggleButtonState = (
  inputList,
  buttonElement,
  { inactiveButtonClass }
) => {
  const isFormInvalid = inputList.some(
    (inputElement) => !inputElement.validity.valid
  );
  buttonElement.disabled = isFormInvalid;
  if (isFormInvalid) {
    buttonElement.classList.add(inactiveButtonClass);
  } else {
    buttonElement.classList.remove(inactiveButtonClass);
  }
};
