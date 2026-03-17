document.addEventListener("DOMContentLoaded", () => {
  const lockIcons = document.querySelectorAll(".lock-icon");

  lockIcons.forEach(icon => {
    const fieldId = icon.dataset.field;
    const input = document.getElementById(fieldId);
    if (!input) return;

    const isFileInput = input.type === "file";
    const storageKeyLock = `lock-${fieldId}`;
    const storageKeyValue = `value-${fieldId}`;

    const isLocked = localStorage.getItem(storageKeyLock) === "true";

    if (!isFileInput) {
      if (isLocked) {
        const savedValue = localStorage.getItem(storageKeyValue);
        if (savedValue !== null) input.value = savedValue;
        input.readOnly = true;
        setLocked(icon);
      } else {
        input.readOnly = false;
        setUnlocked(icon);
      }
    } else {
      isLocked ? setLocked(icon) : setUnlocked(icon);
      dispatchLockEvent(fieldId, isLocked);
    }

    icon.addEventListener("click", () => {
      const currentlyLocked = icon.classList.contains("locked");

      if (!isFileInput) {
        if (currentlyLocked) {
          input.readOnly = false;
          localStorage.setItem(storageKeyLock, "false");
          localStorage.removeItem(storageKeyValue); 
          setUnlocked(icon);
        } else {
          input.readOnly = true;
          localStorage.setItem(storageKeyLock, "true");
          localStorage.setItem(storageKeyValue, input.value);
          setLocked(icon);
        }
      } else {
        if (currentlyLocked) {
          localStorage.setItem(storageKeyLock, "false");
          setUnlocked(icon);
          dispatchLockEvent(fieldId, false);
        } else {
          localStorage.setItem(storageKeyLock, "true");
          setLocked(icon);
          dispatchLockEvent(fieldId, true);
        }
      }
    });
  });

  function setLocked(icon) {
    icon.classList.add("locked");
    icon.classList.remove("unlocked");
  }

  function setUnlocked(icon) {
    icon.classList.add("unlocked");
    icon.classList.remove("locked");
  }

  function dispatchLockEvent(fieldId, isLocked) {
    document.dispatchEvent(new CustomEvent("lockStatusChanged", {
      detail: { fieldId, isLocked }
    }));
  }
});








