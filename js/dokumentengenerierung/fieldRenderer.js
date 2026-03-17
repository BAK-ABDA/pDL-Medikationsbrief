(function (global) {
  function maybeRender(label, value, mode = 'preview') {
    const str = (value !== undefined && value !== null ? String(value).trim() : "");
    const isPlaceholder = /^\[.*\]$/.test(str);
    
    if (mode === 'final') {
      if (str && !isPlaceholder) {
        return `<p>${str}</p>`;
      } else {
        return '';
      }
    } else {
      if (str && !isPlaceholder) {
        return `<p>${str}</p>`;
      } else {
        return `<p><strong>${label}:</strong> ${str || `[${label}]`}</p>`;
      }
    }
  }
  
  function renderInstitutionInfo(values, logoHTML, mode = 'preview') {
    const isPreview = mode === 'preview';
    const blueColor = '#2a5d84';
    
    let leftHTML;
    
    if (isPreview) {
      leftHTML = [
        maybeRender("Apotheke", values.apothekenName, mode),
        maybeRender("Apotheker:in", values.apothekerName, mode),
        maybeRender("Straße Hausnummer", values.apothekeStrasse, mode),
        maybeRender("PLZ Ort", values.apothekePLZOrt, mode),
        `<p>&nbsp;</p>`,
        maybeRender("Praxis", values.praxisName, mode),

        (values.arztNamePraxis === "Ärztin/Arzt")
          ? `<p>zuständige/r Ärztin/Arzt nicht bekannt</p>`
          : maybeRender("Ärztin/Arzt", values.arztNamePraxis, mode),

        maybeRender("Straße Hausnummer", values.praxisStrasse, mode),
        maybeRender("PLZ Ort", values.praxisPLZOrt, mode)
      ].join("\n");

    } else {
      const apoName = values.apothekenName || '';
      const apoIsPlaceholder = /^\[.*\]$/.test(apoName.trim());
      
      const apoStrasse = values.apothekeStrasse || '';
      const apoStrasseIsPlaceholder = /^\[.*\]$/.test(apoStrasse.trim());
      
      const apotheker = values.apothekerName || '';
      const apothekerIsPlaceholder = /^\[.*\]$/.test(apotheker.trim());

      const apoPLZ = values.apothekePLZOrt || '';
      const apoPLZIsPlaceholder = /^\[.*\]$/.test(apoPLZ.trim());
      
      const praxName = values.praxisName || '';
      const praxIsPlaceholder = /^\[.*\]$/.test(praxName.trim());
      
      const arztName = values.arztNamePraxis || '';
      const arztIsPlaceholder = /^\[.*\]$/.test(arztName.trim());
      
      const praxStrasse = values.praxisStrasse || '';
      const praxStrasseIsPlaceholder = /^\[.*\]$/.test(praxStrasse.trim());
      
      const praxPLZ = values.praxisPLZOrt || '';
      const praxPLZIsPlaceholder = /^\[.*\]$/.test(praxPLZ.trim());
      
      const lines = [];
      
      if (!apoName.trim() || apoIsPlaceholder) {
        lines.push(`<p><strong>Von:</strong></p>`);
      } else {
        lines.push(`<p><strong>Von:</strong> ${apoName}</p>`);
      }
      
      if (apotheker.trim() && !apothekerIsPlaceholder) {
        lines.push(`<p>${apotheker}</p>`);
      } else {
        lines.push(`<p>&nbsp;</p>`);
      }
      
      if (apoStrasse.trim() && !apoStrasseIsPlaceholder) {
        lines.push(`<p>${apoStrasse}</p>`);
      } else {
        lines.push(`<p>&nbsp;</p>`);
      }
      
      if (apoPLZ.trim() && !apoPLZIsPlaceholder) {
        lines.push(`<p>${apoPLZ}</p>`);
      } else {
        lines.push(`<p>&nbsp;</p>`);
      }
      
      lines.push(`<p>&nbsp;</p>`);
      
      if (!praxName.trim() || praxIsPlaceholder) {
        lines.push(`<p><strong>An:</strong></p>`);
      } else {
        lines.push(`<p><strong>An:</strong> ${praxName}</p>`);
      }
      
      if (arztName === "Ärztin/Arzt") {
      } else if (arztName.trim() && !arztIsPlaceholder) {
        lines.push(`<p>${arztName}</p>`);
      } else {
        lines.push(`<p>&nbsp;</p>`);
      }
      
      if (praxStrasse.trim() && !praxStrasseIsPlaceholder) {
        lines.push(`<p>${praxStrasse}</p>`);
      } else {
        lines.push(`<p>&nbsp;</p>`);
      }
      
      if (praxPLZ.trim() && !praxPLZIsPlaceholder) {
        lines.push(`<p>${praxPLZ}</p>`);
      } else {
        lines.push(`<p>&nbsp;</p>`);
      }
      
      leftHTML = lines.join("\n");
    }
    
    let rightHTML;
    
    if (isPreview) {
      rightHTML = [
        maybeRender("erstellt am", values.datumBrief || "13.08.2025", mode),
        maybeRender("E-Mail", values.apothekerEmail, mode),
        maybeRender("Telefon", values.apothekerTelefon, mode),
        logoHTML 
          ? `<div style="display:inline-block;">
              ${logoHTML.replace('<img', '<img style="height:100px;width:auto;margin:auto;"')}
            </div>`
          : `<p><strong>Apothekenlogo / Stempel:</strong> [Logo]</p>`
      ].join("\n");
    } else {
      const datum = values.datumBrief || '';
      const datumIsPlaceholder = /^\[.*\]$/.test(datum.trim()) || datum === "13.08.2025";
      
      const email = values.apothekerEmail || '';
      const emailIsPlaceholder = /^\[.*\]$/.test(email.trim());
      
      const telefon = values.apothekerTelefon || '';
      const telefonIsPlaceholder = /^\[.*\]$/.test(telefon.trim());
      
      const lines = [];
      
      if (!datum.trim() || datumIsPlaceholder) {
        lines.push(`<p><strong>erstellt am:</strong></p>`);
      } else {
        lines.push(`<p><strong>erstellt am:</strong> ${datum}</p>`);
      }
      
      if (!email.trim() || emailIsPlaceholder) {
        lines.push(`<p><strong>E-Mail:</strong></p>`);
      } else {
        lines.push(`<p><strong>E-Mail:</strong> ${email}</p>`);
      }
      
      if (!telefon.trim() || telefonIsPlaceholder) {
        lines.push(`<p><strong>Telefon:</strong></p>`);
      } else {
        lines.push(`<p><strong>Telefon:</strong> ${telefon}</p>`);
      }
      
      if (logoHTML) {
        lines.push(`<div style="display:inline-block;">
            ${logoHTML.replace('<img', '<img style="height:100px;width:auto;margin:auto;"')}
          </div>`);
      } else {
        lines.push(`<p><strong>Apothekenlogo / Stempel:</strong></p>`);
      }
      
      rightHTML = lines.join("\n");
    }
    
    return `
      <div class="no-box p institution-info-block" style="display: flex; font-family: Arial, sans-serif;">
        <div style="flex: 1;">${leftHTML}</div>
        <div style="flex: 1;">${rightHTML}</div>
      </div>
    `;
  }

  global.renderInstitutionInfo = renderInstitutionInfo;
})(window);
