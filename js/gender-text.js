function updatePatientGenderText() {
  const gender = document.querySelector('input[name="gender"]:checked')?.value || 'd';
  const name = document.getElementById("patient-name")?.value.trim();

  const genderTextMap = {
    w: "Patientin",
    m: "Patient",
    d: "Patientin/Patient"
  };

  const fullText = name !== "" ? name : genderTextMap[gender];

  const ogTextSpan = document.getElementById("og-text");
  if (ogTextSpan && ogTextSpan.parentElement) {
    const genderCase = ogTextSpan.parentElement.querySelector(".gender-case");
    if (genderCase) {
      genderCase.textContent = fullText;
    }
    ogTextSpan.style.display = "inline";
  }

  const genderCaseMap = {
    w: {
      nominativ: "die Patientin",
      genitiv: "der Patientin",
      dativ: "der Patientin",
      akkusativ: "die Patientin"
    },
    m: {
      nominativ: "der Patient",
      genitiv: "des Patienten",
      dativ: "dem Patienten",
      akkusativ: "den Patienten"
    },
    d: {
      nominativ: "der Patientin/dem Patienten",
      genitiv: "der Patientin/dem Patienten",
      dativ: "der Patientin/dem Patienten",
      akkusativ: "die Patientin/den Patienten"
    }
  };

  document.querySelectorAll(".gender-case").forEach(el => {
    const useName = el.dataset.useName === "true";
    const caseType = el.dataset.case || "nominativ";
    if (useName && name !== "") {
      el.textContent = name;
    } else {
      el.textContent = genderCaseMap[gender][caseType];
    }
  });
}

window.addEventListener("DOMContentLoaded", updatePatientGenderText);
document.querySelectorAll('input[name="gender"]').forEach(radio => {
  radio.addEventListener('change', updatePatientGenderText);
});
document.getElementById("patient-name").addEventListener("input", updatePatientGenderText);

