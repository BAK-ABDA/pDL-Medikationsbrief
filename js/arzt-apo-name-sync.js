document.addEventListener("DOMContentLoaded", function () {
  const arztNameField = document.getElementById("arzt-name");
  const anredeArztField = document.getElementById("anrede-arzt-name");
  const apoNameField = document.getElementById("apo-name");
  const anredeApoEl = document.getElementById("anrede-apo-name");
  
  const writeTo = (target, value) => {
    if (!target) return;
    const v = value ?? "";
    const tag = target.tagName ? target.tagName.toUpperCase() : "";
    if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
      target.value = v;
    } else {
      target.textContent = v;
    }
  };
  
  const syncArzt = () => {
    if (arztNameField && anredeArztField) {
      writeTo(anredeArztField, arztNameField.value);
    }
  };
  
  const syncApo = () => {
    if (apoNameField && anredeApoEl) {
      writeTo(anredeApoEl, apoNameField.value);
    }
  };
  
  const initSync = () => {
    syncArzt();
    syncApo();
  };
  
  if (arztNameField && anredeArztField) {
    ["input", "change", "blur"].forEach(evt => arztNameField.addEventListener(evt, syncArzt));
  }
  
  if (apoNameField && anredeApoEl) {
    ["input", "change", "blur"].forEach(evt => apoNameField.addEventListener(evt, syncApo));
  }

  initSync();

  window.syncFormFields = initSync;

  let lastArzt = arztNameField?.value || "";
  let lastApo = apoNameField?.value || "";
  let pollCount = 0;
  
  const poll = () => {
    if (arztNameField && arztNameField.value !== lastArzt) {
      lastArzt = arztNameField.value;
      syncArzt();
    }
    
    if (apoNameField && apoNameField.value !== lastApo) {
      lastApo = apoNameField.value;
      syncApo();
    }
    
    pollCount++;
    const nextInterval = pollCount < 25 ? 200 : 1000;
    setTimeout(poll, nextInterval);
  };
  
  poll();
  
  const form = arztNameField?.closest('form') || apoNameField?.closest('form');
  if (form) {
    form.addEventListener('reset', () => {
      setTimeout(initSync, 50);
    });
  }
});