document.addEventListener('DOMContentLoaded', function () {
  const logoInput = document.getElementById('logo-upload');
  const previewImg = document.getElementById('logo-preview-img');
  const logoPreview = document.getElementById('logo-preview');
  const logoRemove = document.getElementById('logo-remove');
  const uploadArea = document.querySelector('.logo-upload-wrapper .upload-area');
  const placeholder = document.getElementById('logo-upload-placeholder');

  let selectedLogoFile = null;
  let isLocked = false;

  function getIsLocked() {
    return localStorage.getItem('lock-logo-upload') === 'true';
  }

  function updateUploadState(locked) {
    isLocked = locked;
    if (logoInput) logoInput.disabled = locked;
    if (logoRemove) logoRemove.disabled = locked;
    if (uploadArea) {
      uploadArea.style.pointerEvents = locked ? 'none' : 'auto';
      uploadArea.style.opacity = locked ? '0.6' : '1';
    }
    if (placeholder) placeholder.style.opacity = locked ? '0.5' : '1';
  }

  document.addEventListener('lockStatusChanged', function (e) {
    if (e.detail.fieldId === 'logo-upload') {
      updateUploadState(e.detail.isLocked);
    }
  });

  updateUploadState(getIsLocked());

  const storedLogo = localStorage.getItem('logo-image');
  if (storedLogo && getIsLocked() && previewImg && logoPreview && placeholder) {
    previewImg.src = storedLogo;
    logoPreview.style.display = 'flex';
    placeholder.style.display = 'none';
  } else {
    if (logoPreview) logoPreview.style.display = 'none';
    if (placeholder) placeholder.style.display = 'block';
  }

  if (uploadArea) {
    uploadArea.addEventListener('dragover', e => {
      e.preventDefault();
      if (!isLocked) uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });
    uploadArea.addEventListener('drop', e => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      if (isLocked) return;

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) handleLogoFile(file);
    });
  }

  if (placeholder) {
    placeholder.addEventListener('click', e => {
      e.stopPropagation();
      if (!isLocked) logoInput.click();
    });
  }

  if (logoInput) {
    logoInput.addEventListener('change', function () {
      if (isLocked) {
        logoInput.value = '';
        return;
      }
      const file = this.files[0];
      if (file && file.type.startsWith('image/')) handleLogoFile(file);
      else logoInput.value = '';
    });
  }

  if (logoRemove) {
    logoRemove.addEventListener('click', e => {
      e.preventDefault();
      if (!isLocked) removeLogoFile();
    });
  }

  function handleLogoFile(file) {
    selectedLogoFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      const data = e.target.result;
      if (previewImg) previewImg.src = data;
      if (placeholder) placeholder.style.display = 'none';
      if (logoPreview) logoPreview.style.display = 'flex';
      localStorage.setItem('logo-image', data);
    };
    reader.readAsDataURL(file);
  }

  function removeLogoFile() {
    selectedLogoFile = null;
    if (logoInput) logoInput.value = '';
    if (previewImg) previewImg.src = '';
    if (logoPreview) logoPreview.style.display = 'none';
    if (placeholder) placeholder.style.display = 'block';
    localStorage.removeItem('logo-image');
  }

  window.getSelectedLogoFile = () => selectedLogoFile;
});






