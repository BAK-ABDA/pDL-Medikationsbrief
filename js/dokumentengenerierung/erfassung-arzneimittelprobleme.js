function collectProblemEntries() {
  const categoryLabels = {
    interaktionen: "Mögliche Interaktionen/Symptome aufgrund von Interaktionen",
    nebenwirkungen: "Berichtete Nebenwirkungen",
    auswahl: "Probleme, die die Auswahl des Arzneimittels betreffen",
    dosierung: "Probleme, die die Dosierung und Therapiedauer betreffen",
    darreichung: "Probleme, die die Darreichungsform der Arzneimittel betreffen",
    zusatzinformationen: (name) => `Zusätzlich relevante Informationen${name ? ` zu ${name}` : ""}`
  };

  const patientName = document.getElementById("patient-name")?.value.trim() || "";

  const entries = [];

  document.querySelectorAll('#problemFields .problem-block').forEach(block => {
    const categoryKey = block.dataset.category;
    let category = categoryLabels[categoryKey] || categoryKey;

    if (typeof category === "function") {
      category = category(patientName);
    }

    const text = block.querySelector('textarea')?.value.trim() || "\u200B";

    entries.push({ category, text });
  });

  return entries;
}


