"use strict";
if (navigator.serviceWorker && !location.href.includes('local')) {
  const isFirstInstall = !(
    navigator.serviceWorker.controller instanceof ServiceWorker
  ); // при первой установке на клиенте еще нет sw

  if (location.pathname.match(/reload/)){
    navigator.serviceWorker.getRegistration()
      .then(x => x.unregister())
      .then(x => location.pathname = '/');
  }
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      action: 'init'
    });
  }else {
    navigator.serviceWorker.register("/sw2.js", {scope: "/"}).then(reg => {
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
        break;

      case "init":
        window.dispatchEvent(new CustomEvent('init'))
        console.log('init')
        break;
      case "new-version":
        console.log('app has new version');
        break;
    }
  });
  navigator.serviceWorker.addEventListener("activate", ({ data }) => {
    console.log(data);
  });
  window.addEventListener('beforeinstallprompt', console.log)
}else{
  window.addEventListener('load', ()=>{
    window.dispatchEvent(new CustomEvent('init'))
    console.log('init')
  }, {once: true})
}
