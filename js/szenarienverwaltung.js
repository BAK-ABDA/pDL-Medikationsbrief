document.addEventListener("DOMContentLoaded", function () {
  const keineCB = document.getElementById("keine-auffaelligkeiten");
  const mitCB = document.getElementById("mit-auffaelligkeiten");
  const bereich = document.getElementById("auffaelligkeiten-bereich");
  const infoBox = document.querySelector(".info-checkboxes");

  const symptomeCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"][name^="symptome"]'));
  const nierenfunktionCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"][name^="nierenfunktion"]'));

  const symptomTextarea = document.getElementById("symptom-textarea");
  const symptomVorhandenCB = document.getElementById("symptom-vorhanden");

  const datumNierenfunktion = document.getElementById("datum-nierenfunktion");
  const quelle = document.getElementById("quelle");
  const nierenfunktionTextarea = document.getElementById("nierenfunktion-textarea");
  const nierenfunktionBekannt = document.querySelector('input[name="nierenfunktion-bekannt"]');

  const nichtBeruecksichtigtCB = document.getElementById("nicht-beruecksichtigt");
  const beruecksichtigtCB = document.getElementById("beruecksichtigt");
  const begruendungInput = document.getElementById("begruendung");

  const analyseMap = {
    "analyse-eml": ["datum-bmp"],
    "analyse-bmp": ["datum-bmp-emp"],
    "analyse-arztbrief": ["arztbrief-einrichtung", "datum-arztbrief"],
    "analyse-sonstiges": ["analyse-sonstiges-text"]
  };

  function clearAllABPs() {
    const container = document.getElementById("problemFields");
    const selectElement = document.getElementById("problemCategorySelect");

    if (container) {
      const problemBlocks = container.querySelectorAll(".problem-block");
      problemBlocks.forEach(block => container.removeChild(block));
    }

    if (selectElement) {
      selectElement.querySelectorAll("option").forEach(option => {
        if (option.value) option.disabled = false;
      });
      selectElement.selectedIndex = 0;
    }

    if (window.addedCategories) window.addedCategories.clear();
  }

  function clearInfoRadios() {
    document.querySelectorAll('input[name="medikationsbrief-info"]').forEach(r => r.checked = false);
  }

  function onSymptomeChange(shouldClear = true) {
    if (!symptomTextarea || !symptomVorhandenCB) return;

    if (symptomVorhandenCB.checked) {
      symptomTextarea.disabled = false;
    } else {
      symptomTextarea.disabled = true;
      if (shouldClear) symptomTextarea.value = "";
    }
  }

  function onNierenfunktionChange(shouldClear = true) {
    const enabled = nierenfunktionBekannt?.checked || false;

    if (datumNierenfunktion) {
      datumNierenfunktion.disabled = !enabled;
      if (!enabled && shouldClear) datumNierenfunktion.value = "";
    }

    if (quelle) {
      quelle.disabled = !enabled;
      if (!enabled && shouldClear) quelle.value = "";
    }

    if (nierenfunktionTextarea) {
      nierenfunktionTextarea.disabled = !enabled;
      if (!enabled && shouldClear) nierenfunktionTextarea.value = "";
    }

    if (nichtBeruecksichtigtCB) {
      nichtBeruecksichtigtCB.disabled = !enabled;
      if (!enabled) nichtBeruecksichtigtCB.checked = false;
    }
    if (beruecksichtigtCB) {
      beruecksichtigtCB.disabled = !enabled;
      if (!enabled) beruecksichtigtCB.checked = false;
    }

    if (begruendungInput) {
      begruendungInput.disabled = !enabled;
      if (!enabled) begruendungInput.value = "";
    }
  }

  function updateAnalyseFields() {
    Object.keys(analyseMap).forEach(cbId => {
      const checkbox = document.getElementById(cbId);
      const fieldIds = analyseMap[cbId];

      if (!checkbox) return;

      fieldIds.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;

        if (checkbox.checked) {
          field.disabled = false;
        } else {
          field.disabled = true;
          field.value = "";
        }
      });
    });
  }

  function handleExclusiveCheckboxes() {
    document.querySelectorAll('input[type="checkbox"][data-group]').forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        const group = this.getAttribute('data-group');

        if (this.checked) {
          document.querySelectorAll(`input[type="checkbox"][data-group="${group}"]`).forEach(cb => {
            if (cb !== this) cb.checked = false;
          });
        }

        if (group === 'symptome') onSymptomeChange();
        if (group === 'nierenfunktion') onNierenfunktionChange();
      });
    });
  }

  function updateAnzeige() {
    if (mitCB.checked) {
      bereich.style.display = "block";
      infoBox.style.display = "block";
    } else {
      bereich.style.display = "none";
      infoBox.style.display = "none";

      clearAllABPs();

      if (symptomTextarea) symptomTextarea.value = "";
      if (datumNierenfunktion) datumNierenfunktion.value = "";
      if (quelle) quelle.value = "";
      if (nierenfunktionTextarea) nierenfunktionTextarea.value = "";
      if (nichtBeruecksichtigtCB) nichtBeruecksichtigtCB.checked = false;
      if (beruecksichtigtCB) beruecksichtigtCB.checked = false;
      if (begruendungInput) begruendungInput.value = "";
    }

    clearInfoRadios();
  }

  symptomeCheckboxes.forEach(cb => cb.addEventListener("change", onSymptomeChange));
  nierenfunktionCheckboxes.forEach(cb => cb.addEventListener("change", onNierenfunktionChange));

  handleExclusiveCheckboxes();

  keineCB.addEventListener("change", updateAnzeige);
  mitCB.addEventListener("change", updateAnzeige);

  Object.keys(analyseMap).forEach(cbId => {
    const checkbox = document.getElementById(cbId);
    if (checkbox) checkbox.addEventListener("change", updateAnalyseFields);
  });

  updateAnzeige();
  onSymptomeChange();
  onNierenfunktionChange();
  updateAnalyseFields();
});


