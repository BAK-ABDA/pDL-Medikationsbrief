const categoryLabels = {
  interaktionen: "Mögliche Interaktionen/Symptome aufgrund von Interaktionen",
  nebenwirkungen: "Berichtete Nebenwirkungen",
  auswahl: "Probleme, die die Auswahl des Arzneimittels betreffen",
  dosierung: "Probleme, die die Dosierung und Therapiedauer betreffen",
  darreichung: "Probleme, die die Darreichungsform der Arzneimittel betreffen",
  zusatzinformationen: (name) => `Zusätzlich relevante Informationen${name ? ` zu ${name}` : ""}`
};

const categoryPlaceholders = {
  interaktionen: "Problembeschreibung…",
  nebenwirkungen: "Problembeschreibung…",
  auswahl: "z.B. Doppelmedikation, Arzneimittel ohne Indikation...",
  dosierung: "z.B. problematische Dosierungen, Einnahmezeitpunkte, Dosierungsintervalle...",
  darreichung: "Problembeschreibung…",
  zusatzinformationen: "z.B. zu Vitalparametern, zur Adhärenz oder zu weiteren an der Therapie beteiligten Personen..."
};

const addedCategories = new Set();
const MAX_ABP_CHARS = 2000;

let choicesInstance = null;

function getChoicesOuter(instance, selectElement) {
  return (
    (instance?.containerOuter && (instance.containerOuter.element || instance.containerOuter)) ||
    selectElement?.closest?.(".choices") ||
    null
  );
}

function initChoices(selectElement) {
  if (!window.Choices || !selectElement) return null;

  if (selectElement._choicesInstance) {
    return selectElement._choicesInstance;
  }

  const instance = new Choices(selectElement, {
    searchEnabled: false,
    itemSelectText: "",
    shouldSort: false,
    placeholder: true,
    placeholderValue: "➕ Kategorie auswählen…"
  });

  selectElement._choicesInstance = instance;

  const outer = getChoicesOuter(instance, selectElement);
  if (outer?.classList) outer.classList.add("custom-select");

  return instance;
}

function resetSelect(selectElement) {
  selectElement.value = "";

  if (choicesInstance) {
    if (typeof choicesInstance.removeActiveItems === "function") {
      choicesInstance.removeActiveItems();
    }
    if (typeof choicesInstance.hideDropdown === "function") {
      choicesInstance.hideDropdown(true);
    }
  }
}

function rebuildChoices(selectElement) {
  if (!selectElement) return;

  const existing = selectElement._choicesInstance || choicesInstance;

  if (existing && typeof existing.destroy === "function") {
    try { existing.destroy(); } catch (e) {}
  }

  selectElement._choicesInstance = null;

  choicesInstance = initChoices(selectElement);

  for (const val of addedCategories) {
    if (choicesInstance?.disableItemByValue) {
      choicesInstance.disableItemByValue(val);
    }
  }

  resetSelect(selectElement);
}

function disableCategory(selectElement, value) {
  const opt = selectElement.querySelector(`option[value="${value}"]`);
  if (opt) opt.disabled = true;

  if (choicesInstance?.disableItemByValue) {
    choicesInstance.disableItemByValue(value);
  } else if (choicesInstance) {
    rebuildChoices(selectElement);
  }
}

function enableCategory(selectElement, value) {
  const opt = selectElement.querySelector(`option[value="${value}"]`);
  if (opt) opt.disabled = false;

  if (choicesInstance?.enableItemByValue) {
    choicesInstance.enableItemByValue(value);
  } else if (choicesInstance) {
    rebuildChoices(selectElement);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const selectElement = document.getElementById("problemCategorySelect");
  const container = document.getElementById("problemFields");
  const patientNameInput = document.getElementById("patient-name");

  if (!selectElement || !container) return;

  choicesInstance = initChoices(selectElement);

  function updateZusatzinformationenOptionText() {
    const opt = selectElement.querySelector('option[value="zusatzinformationen"]');
    if (!opt) return;

    const name = patientNameInput ? patientNameInput.value.trim() : "";
    const newText = categoryLabels.zusatzinformationen(name);

    if (opt.textContent !== newText) {
      opt.textContent = newText;

      if (choicesInstance) rebuildChoices(selectElement);
    }
  }

  if (patientNameInput) updateZusatzinformationenOptionText();

  selectElement.addEventListener("change", function () {
    const selectedValue = this.value;

    if (!selectedValue || addedCategories.has(selectedValue)) {
      resetSelect(selectElement);
      return;
    }

    addedCategories.add(selectedValue);

    const wrapper = document.createElement("div");
    wrapper.className = "problem-block";
    wrapper.style.marginBottom = "15px";
    wrapper.dataset.category = selectedValue;

    const label = document.createElement("label");
    let labelText = categoryLabels[selectedValue];

    if (typeof labelText === "function") {
      const name = patientNameInput ? patientNameInput.value.trim() : "";
      labelText = labelText(name);
    }
    label.innerHTML = `<strong>${labelText}</strong>`;

    const textarea = document.createElement("textarea");
    textarea.placeholder = categoryPlaceholders[selectedValue] || "Problembeschreibung…";
    textarea.rows = 3;
    textarea.style.width = "100%";
    textarea.style.marginTop = "5px";
    textarea.maxLength = MAX_ABP_CHARS;

    textarea.addEventListener("input", () => {
      if (textarea.value.length > MAX_ABP_CHARS) {
        textarea.value = textarea.value.slice(0, MAX_ABP_CHARS);
      }
    });

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "🗑️ Entfernen";
    removeBtn.type = "button";
    removeBtn.style.marginTop = "5px";

    removeBtn.onclick = () => {
      container.removeChild(wrapper);
      addedCategories.delete(selectedValue);
      enableCategory(selectElement, selectedValue);
      resetSelect(selectElement);
    };

    wrapper.appendChild(label);
    wrapper.appendChild(textarea);
    wrapper.appendChild(removeBtn);
    container.appendChild(wrapper);

    disableCategory(selectElement, selectedValue);
    resetSelect(selectElement);
  });

  if (patientNameInput) {
    patientNameInput.addEventListener("input", () => {
      updateZusatzinformationenOptionText();

      document.querySelectorAll(".problem-block").forEach(block => {
        if (block.dataset.category === "zusatzinformationen") {
          const strong = block.querySelector("label strong");
          if (strong) {
            strong.textContent = categoryLabels.zusatzinformationen(patientNameInput.value.trim());
          }
        }
      });
    });
  }

  if (window.Sortable) {
    new Sortable(container, {
      animation: 150,
      handle: "label",
      ghostClass: "sortable-ghost"
    });
  }
});


