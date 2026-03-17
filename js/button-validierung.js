document.addEventListener("DOMContentLoaded", function () {
  const requiredFields = [
    document.getElementById("apothekenname"),
    document.getElementById("apo-name"),
    document.getElementById("arzt-name"),
    document.getElementById("datum-brief"),
    document.getElementById("patient-name")
  ];
  const nichtBeruecksichtigtCB = document.getElementById("nicht-beruecksichtigt");
  const begruendungField = document.getElementById("begruendung");
  const buttons = [
    document.getElementById("btn-save-pdf"),
    document.getElementById("btn-print-doc")
  ];
  
  window.checkRequiredFields = function() {
    let dynamicRequiredFields = [...requiredFields];
    if (nichtBeruecksichtigtCB && begruendungField) {
      if (nichtBeruecksichtigtCB.checked) {
        begruendungField.required = true;
        dynamicRequiredFields.push(begruendungField);
      } else {
        begruendungField.required = false;
        begruendungField.value = "";
      }
    }
    
    const allFilled = dynamicRequiredFields.every(
      input => input && input.value.trim() !== ""
    );
    
    buttons.forEach(btn => {
      if (btn) btn.disabled = !allFilled;
    });
  };
  
  requiredFields.forEach(input => {
    if (input) input.addEventListener("input", window.checkRequiredFields);
  });
  
  if (nichtBeruecksichtigtCB) {
    nichtBeruecksichtigtCB.addEventListener("change", function () {
      window.checkRequiredFields();
    });
  }
  
  if (begruendungField) {
    begruendungField.addEventListener("input", window.checkRequiredFields);
  }
  
  window.checkRequiredFields();
});



