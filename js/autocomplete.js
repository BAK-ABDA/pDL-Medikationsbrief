document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".institution-info-block input[type='text']");

  inputs.forEach(input => {
    let selectedIndex = -1; 

    input.addEventListener("input", () => {
      showSuggestions(input);
      selectedIndex = -1; 
    });

    let isClickingSuggestion = false;

    document.addEventListener("mousedown", (e) => {
      isClickingSuggestion = e.target.classList.contains("autocomplete-item");
    });

    input.addEventListener("blur", () => {
      saveInputValue(input.value, input.id); 
      setTimeout(() => removeSuggestionBox(input), 150);
      selectedIndex = -1;
    });

    input.addEventListener("keydown", (e) => {
      const box = input.parentNode.querySelector(".autocomplete-box");
      if (!box) return;

      const items = box.querySelectorAll(".autocomplete-item");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateHighlight(items, selectedIndex);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateHighlight(items, selectedIndex);
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0) {
          e.preventDefault();
          input.value = items[selectedIndex].textContent;
          removeSuggestionBox(input);
        }
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.matches(".institution-info-block input[type='text']") &&
      !e.target.matches(".autocomplete-item")
    ) {
      document.querySelectorAll(".autocomplete-box").forEach(box => box.remove());
    }
  });
});

function saveInputValue(value, key) {
  if (!value.trim() || !key) return; 

  let stored = JSON.parse(localStorage.getItem("autocompleteData")) || {};
  if (!stored[key]) stored[key] = {};
  stored[key][value] = (stored[key][value] || 0) + 1;

  localStorage.setItem("autocompleteData", JSON.stringify(stored));
}

function showSuggestions(input) {
  const key = input.id; 
  if (!key) return;

  const stored = JSON.parse(localStorage.getItem("autocompleteData")) || {};
  const values = stored[key] ? Object.entries(stored[key]) : [];

  const query = input.value.toLowerCase();
  const matches = values
    .filter(([val]) => val.toLowerCase().includes(query))
    .sort((a, b) => b[1] - a[1])
    .map(([val]) => val);

  removeSuggestionBox(input);

  if (matches.length > 0 && query.length > 0) {
    const box = document.createElement("div");
    box.className = "autocomplete-box";

    matches.slice(0, 5).forEach(match => {
      const option = document.createElement("div");
      option.className = "autocomplete-item";
      option.textContent = match;

      option.addEventListener("mousedown", () => {
        input.value = match;
        removeSuggestionBox(input);
      });

      box.appendChild(option);
    });

    input.parentNode.style.position = "relative";
    input.parentNode.appendChild(box);
  }
}

function removeSuggestionBox(input) {
  const oldBox = input.parentNode.querySelector(".autocomplete-box");
  if (oldBox) oldBox.remove();
}

function updateHighlight(items, index) {
  items.forEach((item, i) => {
    if (i === index) {
      item.classList.add("highlighted");
      item.scrollIntoView(false);
    } else {
      item.classList.remove("highlighted");
    }
  });
}






