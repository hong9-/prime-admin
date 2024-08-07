if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

window.appInstalled = true;

const handler = async(event)=> {
  console.log('handler sett!!!!', event)
  window.deferredPrompt = event;
  event.preventDefault();
  const relatedApps = await (navigator.getInstalledRelatedApps && navigator.getInstalledRelatedApps());
  
  if(relatedApps) {
    console.log("relatedApps: ", relatedApps);
    const psApp = relatedApps?.find((app) => app.id === "net.sytes.hong9");
  
    if (psApp) {
      window.appInstalled = true;
      event.preventDefault();
      // Update UI as appropriate4
    } else {
      event.preventDefault();
      window.appInstalled = false;
    }

  } else {
    window.appInstalled = false;
  }
}
console.log("eventListeners 등록")
window.addEventListener('beforeinstallprompt', handler);


