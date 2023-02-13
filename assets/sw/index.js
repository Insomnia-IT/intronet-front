"use strict";
if (navigator.serviceWorker && !location.host.includes("local")) {
  const isFirstInstall = !(
    navigator.serviceWorker.controller instanceof ServiceWorker
  ); // при первой установке на клиенте еще нет sw

  navigator.serviceWorker
    .register("/sw.js", { scope: "/" })
    .then((reg) => logSw(`registered scope: '${reg.scope}'`))
    .catch((err) => errSw("registration error", err));

  navigator.serviceWorker.addEventListener("message", ({ data }) => {
    switch (data.type) {
      case "RELOAD_PAGE":
        if (isFirstInstall) return; // нет смысла рефрешить страницу при первой установке
        logSw(`start client reloading on ${new Date()}`);
        window.location.reload();
        break;
      default:
        warnSw(`unhandled message "${data.type}"`);
    }
  });
  window.addEventListener("beforeinstallprompt", event => {
    window.installApp = event.prompt();
    event.userChoice
      .then(choiceResult => {
        this.userChoiceResult = choiceResult.outcome;
        console.info(userChoiceResult)
        window.installApp = null;
      })
      .catch((error) => {
        console.error(error)
      });
  });

  //region Update

  /**
   * Initiator[1]. Запустить обновление после каждого открытия/рефреша страницы.
   * Кейс: пользователь, уходя с работы, закрывает браузер.
   */
  startAllSwUpdates(1);

  /**
   * Initiator[2]. Запустить ночное обновление.
   * Кейс: компьютер и браузер пользователя включены круглосуточно.
   *       Пользователь рефрешит приложение раз в несколько дней или никогда.
   */
  setInterval(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 10)
      // предпринять несколько попыток для надежности
      startAllSwUpdates(2);
  }, 60_000 * 3);

  /**
   * Initiator[3]. Запустить обновление при выходе из Спящего режима.
   * Кейс: компьютер пользователя настроен на переход в Спящий режим.
   * TODO
   */

  /**
   * Initiator[4]. Запустить обновление при выходе браузера из состояния FROZEN.
   * Кейс: хром решил, что надо заморозить вкладку. Предполагается, что все другие инициаторы могут не сработать.
   * https://developers.google.com/web/updates/2018/07/page-lifecycle-api
   */
  document.addEventListener("resume", (event) => startAllSwUpdates(4));

  async function startAllSwUpdates(initiator) {
    if (isFirstInstall) return;
    logSw(`start all updates by Initiator[${initiator}] on ${new Date()}`);
    await updateSwCaches();
    if (initiator !== 1)
      // при открытии/рефреше страницы браузер самостоятельно запускает апдейт по стандартной схеме
      updateSwStandard();
  }

  /**
   * Стандартное обновление sw.
   * Браузер скачает с сервера скрипт sw и все файлы из importScripts, а затем проверит:
   * "А не изменилось ли содержимое скрипта сервис воркера? А не изменилось ли содержимое какого-либо файла из importScripts?".
   * Если хоть один из файлов изменился, тогда браузер запустит процесс установки новой версии sw.
   */
  function updateSwStandard() {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((reg) => {
        reg.update();
        logSw(
          `update standard. Check for updates, scope: '${
            reg.scope
          }'. ${new Date()}`
        );
      });
    });
  }

  /**
   * Выполняет обновление кешей sw вне стандартного обновления sw(изменение скрипта sw -> установка новой версии sw).
   * Поэтому перед обновлением кешей надо гарантированно перевести sw в статус RUNNING.
   */
  async function updateSwCaches() {
    const isSwAwake = await wakeUpSw();
    if (isSwAwake) sendToServiceWorker("UPDATE_CACHES");
  }

  //endregion

  /**
   * Браузер всегда старается как можно скорее перевести sw из статуса RUNNING -> в STOPPED.
   * Обычно, если браузер находится в статусе STOPPED, то перевод в RUNNING происходит по приходу сообщения
   * на листенер 'fetch' или 'message'. Но возникали кейсы, когда sw долго(несколько часов) находится
   * в статусе STOPPED и если послать ему сообщение на листенер 'message', то он не просыпается.
   * Поэтому остается только fetch.
   */
  async function wakeUpSw() {
    try {
      logSw(`wake up by request of root version. ${new Date()}`);
      await fetch("/root.version").then((res) => res.text());
      return true;
    } catch (err) {
      errSw(`fail while wake up`, err.message);
    }
    return false;
  }

  function sendToServiceWorker(type, data) {
    if (navigator.serviceWorker.controller) {
      logSw(`send "${type}". ${new Date()}`);
      navigator.serviceWorker.controller.postMessage({ type, data });
    }
  }

  function logSw(...args) {
    console.log(`sw[main]`, ...args);
  }

  function errSw(...args) {
    console.error(`sw[main]`, ...args);
  }

  function warnSw(...args) {
    console.warn(`sw[main]`, ...args);
  }
}
