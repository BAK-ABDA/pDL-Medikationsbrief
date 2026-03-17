document.addEventListener('DOMContentLoaded', () => {
  const leftSide = document.querySelector('.split-box .left-side');
  const rightSide = document.querySelector('.split-box .right-side');
  const keineInput = document.getElementById('keine-auffaelligkeiten');
  const mitInput = document.getElementById('mit-auffaelligkeiten');

  function updateSelection(option) {
    if (option === 'keine') {
      leftSide.classList.add('active');
      rightSide.classList.remove('active');
      keineInput.checked = true;
      keineInput.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      rightSide.classList.add('active');
      leftSide.classList.remove('active');
      mitInput.checked = true;
      mitInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  leftSide.addEventListener('click', () => {
    updateSelection('keine');
  });

  rightSide.addEventListener('click', () => {
    updateSelection('mit');
  });

  if (keineInput.checked) {
    updateSelection('keine');
  } else if (mitInput.checked) {
    updateSelection('mit');
  }
});document.addEventListener('DOMContentLoaded', () => {
  const leftSide = document.querySelector('.split-box .left-side');
  const rightSide = document.querySelector('.split-box .right-side');
  const keineInput = document.getElementById('keine-auffaelligkeiten');
  const mitInput = document.getElementById('mit-auffaelligkeiten');

  function updateSelection(option) {
    if (option === 'keine') {
      leftSide.classList.add('active');
      rightSide.classList.remove('active');
      keineInput.checked = true;
      keineInput.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      rightSide.classList.add('active');
      leftSide.classList.remove('active');
      mitInput.checked = true;
      mitInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  leftSide.addEventListener('click', () => {
    updateSelection('keine');
  });

  rightSide.addEventListener('click', () => {
    updateSelection('mit');
  });

  if (keineInput.checked) {
    updateSelection('keine');
  } else if (mitInput.checked) {
    updateSelection('mit');
  }
});