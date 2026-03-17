document.addEventListener("DOMContentLoaded", () => {
  const patientNameInput = document.getElementById("patient-name");
  const selectElement = document.getElementById("problemCategorySelect");
  if (!patientNameInput || !selectElement) return;

  function getOuter(instance) {
    return (
      (instance?.containerOuter && (instance.containerOuter.element || instance.containerOuter)) ||
      selectElement.closest(".choices") ||
      null
    );
  }

  function ensureChoicesInstance() {
    if (!window.Choices) return null;

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

    const outer = getOuter(instance);
    if (outer?.classList) outer.classList.add("custom-select");

    return instance;
  }

  function rebuildChoicesInstance() {
    const old = selectElement._choicesInstance;

    if (old && typeof old.destroy === "function") {
      try { old.destroy(); } catch (e) {}
    }

    selectElement._choicesInstance = null;

    return ensureChoicesInstance();
  }

  function setZusatzinformationenOptionText() {
    const name = patientNameInput.value.trim();
    const option = selectElement.querySelector('option[value="zusatzinformationen"]');
    if (!option) return;

    const newText = name
      ? `Zusätzlich relevante Informationen zu ${name}`
      : `Zusätzlich relevante Informationen`;

    if (option.textContent === newText) return;

    option.textContent = newText;

    const choices = ensureChoicesInstance();
    if (!choices) return;

    const newInstance = rebuildChoicesInstance();

    if (newInstance && typeof newInstance.removeActiveItems === "function") {
      newInstance.removeActiveItems();
    }
  }

  ensureChoicesInstance();

  setZusatzinformationenOptionText();

  patientNameInput.addEventListener("input", setZusatzinformationenOptionText);
});
