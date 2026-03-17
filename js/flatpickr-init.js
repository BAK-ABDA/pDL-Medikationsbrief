    flatpickr("#patient-geburtsdatum", {
      dateFormat: "d.m.Y",
      locale: "de",
      allowInput: true
    });


    flatpickr("#datum-nierenfunktion", {
      dateFormat: "d.m.Y",
      locale: "de",
      allowInput: true,
    });

    flatpickr("#datum-arztbrief", {
      dateFormat: "d.m.Y",
      locale: "de",
      allowInput: true
    });

    flatpickr("#datum-medikationsplan", {
      dateFormat: "d.m.Y",
      locale: "de",
      allowInput: true,
      defaultDate: "today"
    });

    flatpickr("#datum-brief", {
      dateFormat: "d.m.Y",
      locale: "de",
      allowInput: true,
      defaultDate: "today"
    });

    flatpickr("#datum-bmp", {
      dateFormat: "d.m.Y",
      locale: "de",
      allowInput: true
    });
    
    flatpickr("#datum-bmp-emp", {
      dateFormat: "d.m.Y",
      locale: "de",
      allowInput: true
    });
    
const yearEl = document.getElementById("copyright-year");
yearEl.textContent = new Date().getFullYear();


