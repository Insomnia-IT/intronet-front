"use strict";
import {ServiceWorkerAction} from "./actions";

if (navigator.serviceWorker && !location.href.includes('localhost')) {

  const handle = globalThis.ServiceWorkerHandle = {
    event: null as BeforeInstallPromptEvent,
    worker: navigator.serviceWorker.controller,
    size: 0,
    get percent(){
      return this.size / 2223289;
    },
    reload(){
      this.worker.postMessage({
        action: 'reload' as ServiceWorkerAction,
      });
    },
    check(force : boolean){
      this.worker.postMessage({
        action: 'check' as ServiceWorkerAction,
        force
      });
    }
  }

  const isFirstInstall = !(
    navigator.serviceWorker.controller instanceof ServiceWorker
  ); // при первой установке на клиенте еще нет sw

  if (location.pathname.match(/\.reload/)){
    navigator.serviceWorker.getRegistration()
      .then(x => x?.unregister())
      .then(x => location.pathname = '/');
  }
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      action: 'init'
    });
  }else {
    navigator.serviceWorker.register("/sw.min.js", {scope: "/"}).then(reg => {
      reg.addEventListener('updatefound', () => {
        // A wild service worker has appeared in reg.installing!
        const newWorker = reg.installing;

        // "installing" - the install event has fired, but not yet complete
        // "installed"  - install complete
        // "activating" - the activate event has fired, but not yet complete
        // "activated"  - fully active
        // "redundant"  - discarded. Either failed install, or it's been
        //                replaced by a newer version

        newWorker.addEventListener('statechange', () => {

          if(newWorker.state === "activated"){
            handle.worker = newWorker;
            newWorker.postMessage({
              action: 'init'
            });
          }
          // newWorker.state has changed
        });
      });
    })
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log(navigator.serviceWorker.controller)
    // This fires when the service worker controlling this page
    // changes, eg a new worker has skipped waiting and become
    // the new active worker.
  });

  navigator.serviceWorker.addEventListener("message", ({ data }) => {
    switch (data.action){
      case "loading":
        handle.size += data.size;
        console.log(`${data.cache}: +${data.size} (${data.url})`)
        animateLoading(handle.percent);
        break;

      case "init":
        init().catch(console.error);
        break;
      case "new-version":
        console.log('app has new version');
        navigator.serviceWorker.getRegistration()
          .then(x => x?.unregister())
          .then(x => location.reload());
        break;
    }
  });
  navigator.serviceWorker.addEventListener<any>("activate", ({ data }) => {
    console.log(data);
  });
  window.addEventListener('beforeinstallprompt', (e: BeforeInstallPromptEvent) => {
    handle.event = e;
  })


}else{
  init().catch(console.error);
}

function animateLoading(percent: number){
  const div: HTMLDivElement = document.querySelector('#start')
    || document.querySelector('#loader');
  div && div.style.setProperty('--percent', Math.round(percent * 100).toString());
}

async function init(){
  const elements: HTMLElement[] = [];
  for (let asset of globalThis.assets) {
    if (asset.endsWith('css')){
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/' + asset;
      elements.push(link);
    }
    if (asset.endsWith('js')){
      const script = document.createElement('script');
      script.type = 'module';
      script.src = '/' + asset;
      elements.push(script);
    }
  }
  await Promise.all(elements.map(x => new Promise(resolve => {
    document.head.appendChild(x);
    x.addEventListener('load', resolve);
  })));
  animateLoading(0);
  window.dispatchEvent(new CustomEvent('init'))
  console.log('init')
}

type BeforeInstallPromptEvent = Event & {

  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: Array<string>;

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<void>;
}
