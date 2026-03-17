document.addEventListener('DOMContentLoaded', function() {
    const pdfUpload = document.getElementById('pdf-upload');
    const pdfPlaceholder = document.getElementById('pdf-upload-placeholder');
    const pdfPreview = document.getElementById('pdf-preview');
    const pdfFilename = document.getElementById('pdf-filename');
    const pdfRemove = document.getElementById('pdf-remove');
    const pdfUploadArea = document.querySelector('.pdf-upload-wrapper .upload-area');
    let selectedPdfFile = null;

    pdfPreview.style.display = 'none';
    pdfPlaceholder.style.display = 'block';

    pdfUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!selectedPdfFile) {
            pdfUploadArea.classList.add('drag-over');
        }
    });

    pdfUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        pdfUploadArea.classList.remove('drag-over');
    });

    pdfUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        pdfUploadArea.classList.remove('drag-over');

        if (selectedPdfFile) {
            return;
        }

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/pdf') {
                handlePdfFile(file);
            } else {
                alert('Bitte wählen Sie eine PDF-Datei aus.');
            }
        }
    });

    pdfUploadArea.addEventListener('click', function(e) {
        if (!selectedPdfFile) {
            pdfUpload.click();
        }
    });

    pdfUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.type === 'application/pdf') {
                handlePdfFile(file);
            } else {
                alert('Bitte wählen Sie eine PDF-Datei aus.');
                pdfUpload.value = '';
            }
        }
    });

    pdfRemove.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        removePdfFile();
    });

    function handlePdfFile(file) {
        selectedPdfFile = file;
        pdfFilename.textContent = `${file.name} (${formatFileSize(file.size)})`;
        pdfPlaceholder.style.display = 'none';
        pdfPreview.style.display = 'block';
        console.log('PDF ausgewählt:', file.name);
    }

    function removePdfFile() {
        selectedPdfFile = null;
        pdfUpload.value = '';
        pdfFilename.textContent = '';
        pdfPreview.style.display = 'none';
        pdfPlaceholder.style.display = 'block';
        console.log('PDF entfernt');
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function handlePdfFile(file) {
    selectedPdfFile = file;
    
    if (typeof currentSelectedPdf !== 'undefined') {
        const reader = new FileReader();
        reader.onload = e => {
            window.currentSelectedPdf = {
                name: file.name,
                data: e.target.result,
                type: file.type
            };
        };
        reader.readAsDataURL(file);
    }
    
    pdfFilename.textContent = `${file.name} (${formatFileSize(file.size)})`;
    pdfPlaceholder.style.display = 'none';
    pdfPreview.style.display = 'block';
    console.log('PDF ausgewählt:', file.name);
}
});

