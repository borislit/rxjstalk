'use strict';

const pokeHistory = $('.js-poke');
const messageHistory = $('.js-history');
const disconnectButton = $('.js-disconnect');

const CHAT_URL = 'http://api.icndb.com/jokes/random';
const MAX_RETRIES = 3;

let xhr = null,
  token = null;

function fetchMessages() {

  if (xhr && xhr.readyState !== 4) {
    xhr.abort();
  }

  xhr = $.getJSON(CHAT_URL)
    .always(() => xhr = null);

  return xhr;

}

function renderMessage(msg) {
  messageHistory.append(`<div class="chat__message"><b>Him:</b> ${msg}</div>`);
}

function retry(fn, maxRetries) {
  return fn().fail(err => {
    if (maxRetries <= 0) {
      throw err;
    }
    return retry(fn, maxRetries - 1);
  });
}

function updateMessagesList() {
  retry(fetchMessages, MAX_RETRIES)
    .then((data) => data.value.joke)
    .then(renderMessage);

}

function onPoke() {
  updateMessagesList();
}

function teardown() {
  if (xhr) {
    xhr.abort();
    xhr = null;
  }
  pokeHistory.off('click', onPoke);
  clearInterval(token);
  token = null;
}

function pollMessages() {
  return setInterval(updateMessagesList, 4000);
}

pokeHistory.click(onPoke);

disconnectButton.click(teardown);

token = pollMessages();

