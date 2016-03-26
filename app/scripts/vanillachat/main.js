const pokeHistory = $('.js-poke');
const messageHistory = $('.js-history');
const disconnectButton = $('.js-disconnect');

const CHAT_URL = 'http://api.icndb.com/jokes/random';
const MAX_RETRIES = 3;

let xhr;

function fetchMessages() {

  if (xhr && xhr.readyState != 4) {
    xhr.abort();
  }

  xhr = $.getJSON(CHAT_URL)
        .always(() => xhr = null);

  return xhr;

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

function pollMessages() {
  return setInterval(updateMessagesList, 4000);
}

function renderMessage(msg) {
  messageHistory.append(`<div class="chat__message"><b>Him:</b> ${msg}</div>`);
}

function onPoke() {
  updateMessagesList();
}

pokeHistory.click(onPoke);

let token = pollMessages();

disconnectButton.click(() => {
  xhr && xhr.abort();
  pokeHistory.off('click', onPoke);
  clearInterval(token)
});
