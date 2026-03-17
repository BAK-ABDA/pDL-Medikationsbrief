function generateLogoHTML() {
  const img = document.getElementById("logo-preview-img");
  const content = img?.src?.startsWith("data:image")
    ? `<img src="${img.src}" alt="Apothekenlogo" style="max-height: 90px; max-width: 100%;">`
    : `<span style="color: #999; font-size: 10pt;"></span>`;

  return `
    <div style="margin-top: 1rem;">
      <strong>Apothekenlogo / Stempel:</strong>
      <div style="
        height: 100px;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${content}
      </div>
    </div>
  `;
}
