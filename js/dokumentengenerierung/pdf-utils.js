function fileToArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

async function renderPdfToImages(pdfFile) {
    try {
        if (typeof pdfjsLib === 'undefined') {
            console.warn('PDF.js ist nicht geladen. Laden Sie es mit:');
            console.warn('<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>');
            return [];
        }

        const arrayBuffer = await fileToArrayBuffer(pdfFile);
        const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
        const images = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const scale = 2.0;
            const viewport = page.getViewport({scale});
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            const isLandscape = viewport.width > viewport.height;

            images.push({
                dataUrl: canvas.toDataURL('image/png'),
                width: viewport.width / scale,
                height: viewport.height / scale,
                isLandscape: isLandscape
            });
        }

        return images;
    } catch (error) {
        console.error('Fehler beim Rendern des PDFs:', error);
        return [];
    }
}

async function renderElementToCanvas(element) {
    return await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
    });
}

function addCanvasToPDF(pdf, canvas, x, y, width, maxHeight = null) {
    const imgData = canvas.toDataURL('image/png');
    const imgHeight = (canvas.height * width) / canvas.width;
    const actualHeight = maxHeight ? Math.min(imgHeight, maxHeight) : imgHeight;
    pdf.addImage(imgData, 'PNG', x, y, width, actualHeight);
    return actualHeight;
}

function calculateHeightInMM(canvas, contentWidth) {
    return (canvas.height * contentWidth) / canvas.width;
}

async function createAndRenderHTML(htmlContent) {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.innerHTML = htmlContent;
    document.body.appendChild(container);
    
    const canvas = await renderElementToCanvas(container);
    document.body.removeChild(container);
    
    return canvas;
}

function base64ToBlob(base64String, contentType) {
  const parts = base64String.split(';base64,');
  const byteString = atob(parts[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: contentType });
}

async function extractTextFromHTML(htmlString, containerWidth) {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.style.cssText = `
            position: absolute;
            left: -9999px;
            width: ${containerWidth}px;
            visibility: hidden;
        `;
        container.innerHTML = htmlString;
        document.body.appendChild(container);
        
        requestAnimationFrame(() => {
            const textBlocks = [];
            
            const walker = document.createTreeWalker(
                container,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            let node;
            while (node = walker.nextNode()) {
                const text = node.textContent.trim();
                if (!text) continue;
                
                const parent = node.parentElement;
                
                if (parent && parent.classList.contains('checkbox-symbol')) {
                    continue;
                }
                
                if (text === '☐' || text === '☑') {
                    continue;
                }
                
                const range = document.createRange();
                range.selectNodeContents(node);
                const rect = range.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                
                const style = window.getComputedStyle(parent);
                const fontSize = parseFloat(style.fontSize);
                const fontWeight = style.fontWeight;
                
                textBlocks.push({
                    text: text,
                    x: rect.left - containerRect.left,
                    y: rect.top - containerRect.top,
                    width: rect.width,
                    height: rect.height,
                    fontSize: fontSize,
                    fontWeight: fontWeight,
                    element: parent
                });
            }
            
            const mergedBlocks = [];
            for (let i = 0; i < textBlocks.length; i++) {
                const current = textBlocks[i];
                const next = textBlocks[i + 1];
                
                if (next && 
                    Math.abs(current.y - next.y) < 2 &&
                    Math.abs((current.x + current.width) - next.x) < 5) { 
                    
                    mergedBlocks.push({
                        text: current.text + ' ' + next.text,
                        x: current.x,
                        y: current.y,
                        width: (next.x + next.width) - current.x,
                        height: Math.max(current.height, next.height),
                        fontSize: current.fontSize,
                        fontWeight: current.fontWeight,
                        element: current.element
                    });
                    i++; 
                } else {
                    mergedBlocks.push(current);
                }
            }
            
            document.body.removeChild(container);
            resolve(mergedBlocks);
        });
    });
}

async function createAndRenderHTMLWithText(htmlString, containerWidth) {
    const canvas = await createAndRenderHTML(htmlString);
    const textBlocks = await extractTextFromHTML(htmlString, containerWidth);
    
    let filteredTextBlocks = textBlocks.filter(block => {
        const isCheckbox = block.text === '☐' || block.text === '☑';
        return !isCheckbox;
    });
    
    const mergedBlocks = [];
    for (let i = 0; i < filteredTextBlocks.length; i++) {
        const current = filteredTextBlocks[i];
        const next = filteredTextBlocks[i + 1];
        mergedBlocks.push(current);
    }
    
    return { canvas, textBlocks: mergedBlocks };
}