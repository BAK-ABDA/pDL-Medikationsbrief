function collectAnalyseTexte() {
  const texte = [];

  function applyHangingIndent(text, indentSize) {
    const indent = ' '.repeat(indentSize);
    return text.replace(/\n/g, '\n' + indent);
  }

  document.querySelectorAll(".checkbox-group input[type='checkbox']").forEach(cb => {
    const label = cb.closest("label");
    if (!label) return;

    const checked = cb.checked;
    const checkmark = checked ? "☑" : "☐";
    const inputs = label.querySelectorAll("input[type='text']");

    let finalText = '';

    if (inputs.length === 2 && label.textContent.includes("Arztbrief")) {
      const einrichtung = checked ? (inputs[0]?.value.trim() || "[Einrichtung/Arzt]") : "";
      const datum = checked ? (inputs[1]?.value.trim() || "[TT.MM.JJJJ]") : "";

      let text = "eines Arztbriefes";
      if (checked) {
        text += ` von: ${einrichtung}; erstellt am: ${datum}`;
      }
      finalText = `${checkmark} ${text}`;
    }

    else if (inputs.length === 1 && label.textContent.includes("elektronischen Medikationsliste")) {
      const datum = checked ? (inputs[0]?.value.trim() || "[TT.MM.JJJJ]") : "";

      let text = "der elektronischen Medikationsliste (eML in der ePA";
      if (checked) {
        text += datum ? ` vom ${datum}` : " vom [TT.MM.JJJJ]";
      }
      text += ")";
      finalText = `${checkmark} ${text}`;
    }

    else if (inputs.length === 1 && label.textContent.includes("Medikationsplans")) {
      const datum = checked ? (inputs[0]?.value.trim() || "[TT.MM.JJJJ]") : "";

      let text = "des Medikationsplans (BMP/eMP";
      if (checked) {
        text += datum ? ` vom ${datum}` : " vom [TT.MM.JJJJ]";
      }
      text += ")";
      finalText = `${checkmark} ${text}`;
    }

    else if (inputs.length === 1 && label.textContent.includes("Sonstiges")) {
      finalText = `${checkmark} Sonstiges: ${inputs[0]?.value.trim() || "[Sonstiges]"}`;
    }

    else if (inputs.length === 0) {
      let text = '';

      function extractTextFromNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList && node.classList.contains('gender-case')) {
            return node.textContent.trim();
          } else {
            let childText = '';
            node.childNodes.forEach(child => {
              childText += extractTextFromNode(child) + ' ';
            });
            return childText.trim();
          }
        }
        return '';
      }

      label.childNodes.forEach(node => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node.type === 'checkbox' || node.type === 'text')
        ) {
          return;
        }
        const nodeText = extractTextFromNode(node);
        if (nodeText) {
          text += nodeText + ' ';
        }
      });

      text = text.trim().replace(/\s+/g, ' ');

      // ✅ Spezialfall: Beim Label "analyse-alle-medis" den Bindestrich in "verschreibungs-pflichtigen" entfernen
      // Deckt auch typografische Bindestriche ab (z.B. ‐‑–—)
      if (cb.id === "analyse-alle-medis") {
        text = text.replace(/\bverschreibungs[-‐‑‒–—]pflichtigen\b/gi, "verschreibungspflichtigen");
      }

      if (text) {
        finalText = `${checkmark} ${text}`;
      }
    }

    if (finalText) {
      const indentSize = checkmark.length + 1;
      texte.push(applyHangingIndent(finalText, indentSize));
    }
  });

  return texte;
}




