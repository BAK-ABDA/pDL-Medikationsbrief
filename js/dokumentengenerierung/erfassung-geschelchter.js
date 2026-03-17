function generateGenderCheckboxes(selected) {
  return ['w', 'm', 'd'].map(g => `
    <span style="display: inline-block; margin-right: 1.5rem; user-select: none; font-family: Arial, sans-serif; font-size: 10pt;">
      <span class="checkbox-symbol" style="position: relative; top: 3px;">${selected === g ? '☑' : '☐'}</span> ${g}
    </span>
  `).join('');
}

