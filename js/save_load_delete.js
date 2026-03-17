const allInputs = () => Array.from(document.querySelectorAll("input, textarea, select"));

let currentSelectedPdf = null;

window.getSelectedPdfFile = function () {
  if (currentSelectedPdf) {
    return currentSelectedPdf;
  }

  const fileInput = document.getElementById("pdf-upload");
  return fileInput?.files?.[0] ?? null;
};

function showStatus(msg) {
  let box = document.getElementById("status-box");
  if (!box) {
    box = document.createElement("div");
    box.id = "status-box";
    Object.assign(box.style, {
      position: "fixed", bottom: "20px", right: "20px",
      padding: "8px 14px", background: "#333", color: "#fff",
      borderRadius: "8px", fontSize: "14px", opacity: "0.9", zIndex: "10000"
    });
    document.body.appendChild(box);
  }
  box.innerText = msg;
  setTimeout(() => box.innerText = "", 2500);
}

function updateCardDisplay() {
  const leftSide = document.querySelector('.split-box .left-side');
  const rightSide = document.querySelector('.split-box .right-side');
  const keineInput = document.getElementById('keine-auffaelligkeiten');
  const mitInput = document.getElementById('mit-auffaelligkeiten');
  
  if (!leftSide || !rightSide || !keineInput || !mitInput) return;
  
  if (keineInput.checked) {
    leftSide.classList.add('active');
    rightSide.classList.remove('active');
  } else if (mitInput.checked) {
    rightSide.classList.add('active');
    leftSide.classList.remove('active');
  }
}

function updateMedikationsbriefCards() {
  const cards = document.querySelectorAll('.toggle-card');
  const kenntnisnahmeRadio = document.querySelector('input[name="medikationsbrief-info"][value="kenntnisnahme"]');
  const handlungsbedarfRadio = document.querySelector('input[name="medikationsbrief-info"][value="handlungsbedarf"]');
  
  if (!cards.length) return;
  
  cards.forEach(card => card.classList.remove('active'));
  
  if (kenntnisnahmeRadio && kenntnisnahmeRadio.checked) {
    const kenntnisnahmeCard = Array.from(cards).find(card => 
      card.querySelector('input[value="kenntnisnahme"]')
    );
    if (kenntnisnahmeCard) kenntnisnahmeCard.classList.add('active');
  } else if (handlungsbedarfRadio && handlungsbedarfRadio.checked) {
    const handlungsbedarfCard = Array.from(cards).find(card => 
      card.querySelector('input[value="handlungsbedarf"]')
    );
    if (handlungsbedarfCard) handlungsbedarfCard.classList.add('active');
  }
}

function saveFormData() {
  const formData = {
    inputs: {},
    radioGroups: {},
    checkboxGroups: {},
    abpBlocks: [],
    addedCategories: []
  };

  allInputs().forEach(el => {
    if (el.type === "file") return; 
    
    if (el.type === "checkbox" && el.dataset.group) {
      const groupName = el.dataset.group;
      if (!formData.checkboxGroups[groupName]) {
        formData.checkboxGroups[groupName] = [];
      }
      if (el.checked && el.name) {
        formData.checkboxGroups[groupName].push(el.name);
      }
    } else if (el.type === "checkbox" && !el.name) {
      if (el.id) {
        formData.inputs[el.id] = el.checked;
      }
    } else if (el.type === "checkbox" && el.name && !el.dataset.group) {
      if (!formData.radioGroups[el.name]) {
        formData.radioGroups[el.name] = [];
      }
      if (el.checked && el.id) {
        formData.radioGroups[el.name].push(el.id);
      }
    } else if (el.type === "radio") {
      if (el.checked && el.name) {
        formData.radioGroups[el.name] = el.value || el.id;
      }
    } else if (el.type === "radio" && !el.checked && el.name) {
      if (!formData.radioGroups[el.name]) {
        formData.radioGroups[el.name] = null;
      }
    } else if (el.id) {
      formData.inputs[el.id] = el.value;
    }
  });

  const begruendungField = document.getElementById("begruendung");
  if (begruendungField) {
    formData.begruendungVisible = begruendungField.style.display !== "none";
  }

  const nierenfunktionTextarea = document.getElementById("nierenfunktion-textarea");
  if (nierenfunktionTextarea) {
    formData.nierenfunktionTextareaDisabled = nierenfunktionTextarea.disabled;
  }

  const abpContainer = document.getElementById("problemFields");
  if (abpContainer) {
    const blocks = abpContainer.querySelectorAll(".problem-block");
    blocks.forEach(block => {
      const category = block.dataset.category;
      const textarea = block.querySelector("textarea");
      if (category && textarea) {
        formData.abpBlocks.push({
          category: category,
          content: textarea.value
        });
        formData.addedCategories.push(category);
      }
    });
  }

  const auffaelligkeitenBereich = document.getElementById("auffaelligkeiten-bereich");
  if (auffaelligkeitenBereich) {
    formData.auffaelligkeitenSichtbar = auffaelligkeitenBereich.style.display !== "none";
  }

  const zusatztextOutput = document.getElementById("zusatztext-output");
  if (zusatztextOutput) {
    formData.zusatztext = zusatztextOutput.textContent;
  }

  const logo = document.getElementById("logo-preview-img")?.src;
  if (logo?.startsWith("data:")) {
    formData.logo = logo;
  }

  const pdfFile = document.getElementById("pdf-upload")?.files?.[0];
  if (pdfFile && pdfFile.type === "application/pdf") {
    const reader = new FileReader();
    reader.onload = e => {
      formData.pdf = {
        name: pdfFile.name,
        data: e.target.result,
        type: pdfFile.type 
      };
      localStorage.setItem("arzneimittelFormData", JSON.stringify(formData));
      
      currentSelectedPdf = formData.pdf;
      
      showStatus("✅ Formulardaten & PDF gespeichert");
    };
    reader.readAsDataURL(pdfFile);
    return;
  }
  localStorage.setItem("arzneimittelFormData", JSON.stringify(formData));
  showStatus("✅ Formulardaten gespeichert");
}

function loadFormData() {
  const saved = localStorage.getItem("arzneimittelFormData");
  if (!saved) {
    showStatus("ℹ️ Keine gespeicherten Daten gefunden");
    return;
  }

  try {
    const formData = JSON.parse(saved);

    if (formData.inputs) {
      Object.entries(formData.inputs).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (!el) return;
        
        if (el.type === "checkbox") {
          el.checked = value;
        } else {
          if (el.tagName === 'TEXTAREA' && el.disabled) {
            el.disabled = false;
            el.value = value;
          } else {
            el.value = value;
          }
        }
      });
    }

    if (formData.radioGroups) {
      Object.entries(formData.radioGroups).forEach(([name, value]) => {
        if (Array.isArray(value)) {
          const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${name}"]`);
          checkboxes.forEach(cb => {
            cb.checked = value.includes(cb.id);
          });
        } else if (value !== null) {
          const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
          radios.forEach(radio => {
            if (radio.value && radio.value === value) {
              radio.checked = true;
            } else if (!radio.value && radio.id === value) {
              radio.checked = true;
            }
          });
        } else {
          const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
          radios.forEach(radio => {
            radio.checked = false;
          });
        }
      });
    }

    if (formData.checkboxGroups) {
      Object.entries(formData.checkboxGroups).forEach(([groupName, checkedNames]) => {
        const checkboxes = document.querySelectorAll(
          `input[type="checkbox"][data-group="${groupName}"]`
        );

        const textarea =
          groupName === "symptome"
            ? document.getElementById("symptom-textarea")
            : groupName === "nierenfunktion"
            ? document.getElementById("nierenfunktion-textarea")
            : null;

        checkboxes.forEach(cb => {
          cb.checked = checkedNames.includes(cb.name);

          if (cb.checked && textarea) {
            textarea.disabled = false;
          }
        });
      });
    }

    if (formData.begruendungVisible !== undefined) {
      const begruendungField = document.getElementById("begruendung");
      if (begruendungField) {
        begruendungField.style.display = formData.begruendungVisible ? "block" : "none";
      }
    }

    if (formData.nierenfunktionTextareaDisabled !== undefined) {
      const nierenfunktionTextarea = document.getElementById("nierenfunktion-textarea");
      if (nierenfunktionTextarea) {
        nierenfunktionTextarea.disabled = formData.nierenfunktionTextareaDisabled;
      }
    }

    if (formData.abpBlocks && formData.abpBlocks.length > 0) {
      const container = document.getElementById("problemFields");
      const selectElement = document.getElementById("problemCategorySelect");
      
      if (container) {
        container.innerHTML = "";
      }
      
      if (typeof addedCategories !== 'undefined') {
        addedCategories.clear();
      }
      
      if (selectElement) {
        const allOptions = selectElement.querySelectorAll('option');
        allOptions.forEach(opt => {
          if (opt.value !== "") {  
            opt.disabled = false;
          }
        });
      }
      
      formData.abpBlocks.forEach(blockData => {
        if (typeof addedCategories !== 'undefined') {
          addedCategories.add(blockData.category);
        }
        
        const wrapper = document.createElement("div");
        wrapper.className = "problem-block";
        wrapper.style.marginBottom = "15px";
        wrapper.dataset.category = blockData.category;
        
        const categoryLabels = {
          interaktionen: "Mögliche Interaktionen/Symptome aufgrund von Interaktionen",
          nebenwirkungen: "Berichtete Nebenwirkungen:",
          auswahl: "Probleme, die das Arzneimittel betreffen",
          dosierung: "Probleme, die die Dosierung und Therapiedauer betreffen:",
          darreichung: "Probleme, die die Darreichungsform der Arzneimittel betreffen:",
          zusatzinformationen: "Zusätzlich relevante Informationen"
        };
        
        let labelText = categoryLabels[blockData.category] || blockData.category;
        if (blockData.category === "zusatzinformationen") {
          const patientName = formData.inputs["patient-name"] || "";
          labelText = `Zusätzlich relevante Informationen${patientName ? ` zu ${patientName}` : ""}`;
        }

        const label = document.createElement("label");
        
        label.innerHTML = `<strong>${labelText}</strong>`;
        
        const textarea = document.createElement("textarea");
        textarea.value = blockData.content;
        textarea.rows = 3;
        textarea.style.width = "100%";
        textarea.style.marginTop = "5px";
        
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "🗑️ Entfernen";
        removeBtn.type = "button";
        removeBtn.style.marginTop = "5px";
        removeBtn.onclick = () => {
          container.removeChild(wrapper);
          if (typeof addedCategories !== 'undefined') {
            addedCategories.delete(blockData.category);
          }
          restoreOption(selectElement, blockData.category);
        };
        
        wrapper.appendChild(label);
        wrapper.appendChild(textarea);
        wrapper.appendChild(removeBtn);
        container.appendChild(wrapper);
        
        if (selectElement) {
          const option = selectElement.querySelector(`option[value="${blockData.category}"]`);
          if (option) option.disabled = true;
        }
      });
    }

    if (formData.auffaelligkeitenSichtbar !== undefined) {
      const auffaelligkeitenBereich = document.getElementById("auffaelligkeiten-bereich");
      if (auffaelligkeitenBereich) {
        auffaelligkeitenBereich.style.display = formData.auffaelligkeitenSichtbar ? "block" : "none";
      }
    }
    
    const infoCheckboxes = document.querySelector(".info-checkboxes");
    if (infoCheckboxes) {
      const mitAuffaelligkeiten = document.getElementById("mit-auffaelligkeiten");
      if (mitAuffaelligkeiten && mitAuffaelligkeiten.checked) {
        infoCheckboxes.style.display = "block";
      } else {
        infoCheckboxes.style.display = "none";
      }
    }

    if (formData.zusatztext !== undefined) {
      const zusatztextOutput = document.getElementById("zusatztext-output");
      if (zusatztextOutput) {
        zusatztextOutput.textContent = formData.zusatztext;
      }
    }

    if (formData.logo) {
      const preview = document.getElementById("logo-preview");
      const img = document.getElementById("logo-preview-img");
      const placeholder = document.getElementById("logo-upload-placeholder");
      if (preview && img && placeholder) {
        img.src = formData.logo;
        preview.style.display = "flex";
        placeholder.style.display = "none";
      }
    }

    if (formData.pdf) {
      const preview = document.getElementById("pdf-preview");
      const filename = document.getElementById("pdf-filename");
      const placeholder = document.getElementById("pdf-upload-placeholder");

      if (preview && filename && placeholder) {
        filename.innerText = formData.pdf.name;
        preview.style.display = "flex";
        placeholder.style.display = "none";
      }

      currentSelectedPdf = formData.pdf;
    }

    if (typeof onSymptomeChange === 'function') {
      onSymptomeChange(false); 
    }
    if (typeof onNierenfunktionChange === 'function') {
      onNierenfunktionChange(false);
    }

    updateCardDisplay();
    
    updateMedikationsbriefCards();

    showStatus("⏪ Gespeicherte Daten geladen");
    
    if (typeof window.checkRequiredFields === 'function') {
      window.checkRequiredFields();
    }
  } catch (error) {
    showStatus("❌ Fehler beim Laden der Daten");
  }
}

function saveLogo() {
  const file = document.getElementById("logo-upload")?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const data = e.target.result;
    const img = document.getElementById("logo-preview-img");
    const preview = document.getElementById("logo-preview");
    const placeholder = document.getElementById("logo-upload-placeholder");
    if (img && preview && placeholder) {
      img.src = data;
      preview.style.display = "flex";
      placeholder.style.display = "none";
    }
    showStatus("✅ Logo gespeichert");
  };
  reader.onerror = () => showStatus("❌ Fehler beim Laden des Logos");
  reader.readAsDataURL(file);
}

function savePDF() {
  const file = document.getElementById("pdf-upload")?.files?.[0];
  if (!file || file.type !== "application/pdf") return;
  
  const reader = new FileReader();
  reader.onload = e => {
    const data = e.target.result;
    const preview = document.getElementById("pdf-preview");
    const filename = document.getElementById("pdf-filename");
    const placeholder = document.getElementById("pdf-upload-placeholder");
    
    if (preview && filename && placeholder) {
      filename.innerText = file.name;
      preview.style.display = "flex";
      placeholder.style.display = "none";
    }
    
    const formData = JSON.parse(localStorage.getItem("arzneimittelFormData") || "{}");
    formData.pdf = { 
      name: file.name, 
      data: data,
      type: file.type
    };
    localStorage.setItem("arzneimittelFormData", JSON.stringify(formData));
    
    currentSelectedPdf = formData.pdf;
    
    showStatus("✅ PDF gespeichert");
  };
  
  reader.onerror = () => showStatus("❌ Fehler beim Laden des PDFs");
  reader.readAsDataURL(file);
}

function clearFormData() {
  allInputs().forEach(el => {
    if (el.type === "radio" || el.type === "checkbox") {
      el.checked = false;
    } else if (el.type !== "file") {
      el.value = "";
    }
  });

  const container = document.getElementById("problemFields");
  if (container) {
    container.innerHTML = "";
  }

  if (typeof addedCategories !== "undefined" && addedCategories?.clear) {
    addedCategories.clear();
  }

  const selectElement = document.getElementById("problemCategorySelect");
  if (selectElement) {
    selectElement.querySelectorAll("option").forEach(opt => {
      opt.disabled = false;
      opt.selected = false;
    });

    selectElement.value = "";
    selectElement.selectedIndex = 0;

    if (selectElement._choicesInstance && typeof selectElement._choicesInstance.destroy === "function") {
      try {
        selectElement._choicesInstance.destroy();
      } catch (e) {}
    }
    selectElement._choicesInstance = null;

    if (typeof choicesInstance !== "undefined" && choicesInstance && typeof choicesInstance.destroy === "function") {
      try {
        choicesInstance.destroy();
      } catch (e) {}
    }
    if (typeof choicesInstance !== "undefined") {
      choicesInstance = null;
    }

    if (typeof initChoices === "function") {
      const newInst = initChoices(selectElement);
      if (newInst) {
        if (typeof choicesInstance !== "undefined") {
          choicesInstance = newInst;
        }
        selectElement._choicesInstance = newInst;
        if (typeof resetSelect === "function") {
          resetSelect(selectElement);
        } else if (newInst.removeActiveItems) {
          newInst.removeActiveItems();
        }
      }
    }
  }

  const logoPreview = document.getElementById("logo-preview");
  const logoImg = document.getElementById("logo-preview-img");
  const logoPlaceholder = document.getElementById("logo-upload-placeholder");
  if (logoPreview && logoImg && logoPlaceholder) {
    logoPreview.style.display = "none";
    logoImg.src = "";
    logoPlaceholder.style.display = "flex";
  }

  const pdfPreview = document.getElementById("pdf-preview");
  const pdfFilename = document.getElementById("pdf-filename");
  const pdfPlaceholder = document.getElementById("pdf-upload-placeholder");
  if (pdfPreview && pdfFilename && pdfPlaceholder) {
    pdfPreview.style.display = "none";
    pdfFilename.innerText = "";
    pdfPlaceholder.style.display = "flex";
  }

  const begruendungField = document.getElementById("begruendung");
  if (begruendungField) {
    begruendungField.style.display = "none";
    begruendungField.value = "";
  }

  const nierenfunktionTextarea = document.getElementById("nierenfunktion-textarea");
  if (nierenfunktionTextarea) {
    nierenfunktionTextarea.disabled = true;
    nierenfunktionTextarea.value = "";
  }

  const auffaelligkeitenBereich = document.getElementById("auffaelligkeiten-bereich");
  if (auffaelligkeitenBereich) {
    auffaelligkeitenBereich.style.display = "none";
  }

  const keineInput = document.getElementById("keine-auffaelligkeiten");
  if (keineInput) {
    keineInput.checked = true;
    keineInput.dispatchEvent(new Event("change", { bubbles: true }));
  }

  const zusatztextOutput = document.getElementById("zusatztext-output");
  if (zusatztextOutput) {
    const zusatztext =
      " Es wurden keine Auffälligkeiten und relevanten Diskrepanzen zwischen Medikationsplan und tatsächlicher Anwendung festgestellt ";
    zusatztextOutput.textContent = zusatztext;
  }

  updateCardDisplay();
  updateMedikationsbriefCards();

  showStatus("🗑️ Formular geleert");

  if (typeof window.checkRequiredFields === "function") {
    window.checkRequiredFields();
  }
}

function restoreOption(selectElement, value) {
  const option = selectElement?.querySelector(`option[value="${value}"]`);
  if (option) option.disabled = false;
}

document.addEventListener("DOMContentLoaded", () => {
  const floatingBox = document.querySelector(".floating-box");
  if (floatingBox) {
    [
      { text: "💾 Entwurf speichern", fn: saveFormData, id: "saveBtn" },
      { text: "⏪ Entwurf öffnen", fn: loadFormData },
      { 
        text: "🗑️ Leeren", 
        fn: () => showClearWarning(floatingBox, clearFormData), 
        id: "delBtn" 
      }
    ].forEach(({ text, fn, id }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.innerText = text;
      btn.onclick = fn;
      if (id) btn.id = id;
      floatingBox.appendChild(btn);
    });
  }

  document.getElementById("logo-upload")?.addEventListener("change", saveLogo);
  document.getElementById("pdf-upload")?.addEventListener("change", savePDF);
});






