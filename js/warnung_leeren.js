function showClearWarning(targetElement, clearCallback) {
  if (document.getElementById("clear-warning")) return;
  
  const warning = document.createElement("div");
  warning.id = "clear-warning";
  warning.style.cssText = `
    border: 1px solid #dc3545;
    padding: 12px;
    margin-top: 10px;
    background-color: #ffe5e5;
    border-radius: 6px;
    box-sizing: border-box;
  `;
  
  warning.innerHTML = `
    <p style="margin: 0 0 10px 0; font-size: 15px; color: #333; line-height: 1.3; text-align: center;">
      Möchten Sie alle<br>eingegebenen Daten<br>löschen?
    </p>
    <div style="display: flex; gap: 8px;">
      <button id="confirm-clear" style="
        flex: 1;
        padding: 8px 12px;
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        transition: background-color 0.2s;
      ">Ja</button>
      <button id="cancel-clear" style="
        flex: 1;
        padding: 8px 12px;
        background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%) !important;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        transition: background-color 0.2s;
      ">Abbrechen</button>
    </div>
  `;
  
  targetElement.appendChild(warning);
  
  const confirmBtn = document.getElementById("confirm-clear");
  const cancelBtn = document.getElementById("cancel-clear");
  
  confirmBtn.addEventListener("mouseenter", () => {
    confirmBtn.style.background = "linear-gradient(135deg, #c82333 0%, #bd2130 100%)";
  });
  confirmBtn.addEventListener("mouseleave", () => {
    confirmBtn.style.background = "linear-gradient(135deg, #dc3545 0%, #c82333 100%)";
  });
  
  cancelBtn.addEventListener("mouseenter", () => {
    cancelBtn.style.background = "linear-gradient(135deg, #0051D5 0%, #003BA0 100%)";
  });
  cancelBtn.addEventListener("mouseleave", () => {
    cancelBtn.style.background = "linear-gradient(135deg, #007AFF 0%, #0051D5 100%)";
  });
  
  confirmBtn.addEventListener("click", () => {
    clearCallback();
    warning.remove();
  });
  
  cancelBtn.addEventListener("click", () => {
    warning.remove();
  });
}
