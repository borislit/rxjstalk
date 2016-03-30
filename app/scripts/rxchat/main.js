"use strict";

const CHAT_URL = 'http://api.icndb.com/jokes/random';
const MAX_RETRIES = 3;

const pokeButton = document.querySelector('.js-poke');
const messageHistory = $('.js-history');
const disconnectButton = $('.js-disconnect');
const connectButton = $('.js-connect');

const pokeClickStream$ = Rx.Observable.fromEvent(pokeButton, 'click');
const connectClickStream$ = Rx.Observable.fromEvent(connectButton, 'click');
const disconnectClickStream$ = Rx.Observable.fromEvent(disconnectButton, 'click');
const intervalStream$ = Rx.Observable.interval(4000);

const requestStream$ = Rx.Observable
  .merge(intervalStream$, pokeClickStream$);

const responseStream$ = requestStream$
  .switchMap(() => Rx.Observable.fromPromise($.getJSON(CHAT_URL)))
  .retry(MAX_RETRIES)
  .map(data => data.value.joke)
  .takeUntil(disconnectClickStream$);

responseStream$.subscribe(renderMessage);

function renderMessage(msg) {
  messageHistory.append(`<div class="chat__message"><b>Him:</b> ${msg}</div>`);
}
