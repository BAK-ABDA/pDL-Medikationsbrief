document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".toggle-card");
  const kenntnisnahmeRadio = document.querySelector('input[name="medikationsbrief-info"][value="kenntnisnahme"]');
  const handlungsbedarfRadio = document.querySelector('input[name="medikationsbrief-info"][value="handlungsbedarf"]');
  const zusatztextOutput = document.getElementById("zusatztext-output");

  const zusatztext ='. Es wurden keine Auffälligkeiten und relevanten Diskrepanzen zwischen Medikationsplan und tatsächlicher Anwendung festgestellt ';

  const keineAuffaelligkeitenRadio = document.getElementById("keine-auffaelligkeiten");
  const mitAuffaelligkeitenRadio = document.getElementById("mit-auffaelligkeiten");

  if (keineAuffaelligkeitenRadio && mitAuffaelligkeitenRadio && zusatztextOutput) {
    keineAuffaelligkeitenRadio.addEventListener("change", function () {
      if (this.checked) {
        zusatztextOutput.textContent = zusatztext;
      }
    });

    mitAuffaelligkeitenRadio.addEventListener("change", function () {
      if (this.checked) {
        zusatztextOutput.textContent = "";
      }
    });

    if (keineAuffaelligkeitenRadio.checked) {
      zusatztextOutput.textContent = zusatztext;
    }
  }

  function resetMedikationsbriefInfo() {
    if (kenntnisnahmeRadio) kenntnisnahmeRadio.checked = false;
    if (handlungsbedarfRadio) handlungsbedarfRadio.checked = false;
  }

  const arztNameInput = document.getElementById('arzt-name');
  const arztUnbekanntCheckbox = document.getElementById('arzt-unbekannt');

  if (arztUnbekanntCheckbox && arztNameInput) {
    arztUnbekanntCheckbox.addEventListener('change', function () {
      if (this.checked) {
        arztNameInput.value = 'Ärztin/Arzt';
        arztNameInput.disabled = true;
        arztNameInput.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        arztNameInput.disabled = false;
        arztNameInput.value = '';
        arztNameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  }

  const nichtBeruecksichtigtCB = document.getElementById("nicht-beruecksichtigt");
  const beruecksichtigtCB = document.getElementById("beruecksichtigt");
  const begruendungField = document.getElementById("begruendung");
  const folgendeCB = document.getElementById("folgende");
  const nierenfunktionBekannt = document.querySelector('input[name="nierenfunktion-bekannt"]');

  function updateBegruendungField() {
    if (!begruendungField || !nichtBeruecksichtigtCB || !beruecksichtigtCB || !nierenfunktionBekannt) return;

    if (
      nichtBeruecksichtigtCB.checked &&
      nierenfunktionBekannt.checked &&
      (!folgendeCB || folgendeCB.checked)
    ) {
      begruendungField.style.display = "block";
    } else {
      begruendungField.style.display = "none";
      begruendungField.value = "";
    }
  }

  nichtBeruecksichtigtCB?.addEventListener("change", updateBegruendungField);
  beruecksichtigtCB?.addEventListener("change", updateBegruendungField);
  folgendeCB?.addEventListener("change", updateBegruendungField);
  nierenfunktionBekannt?.addEventListener("change", updateBegruendungField);

  updateBegruendungField();
});






