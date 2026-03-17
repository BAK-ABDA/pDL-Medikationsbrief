window.addSelectableText = function (
  pdf,
  text,
  x,          
  y,          
  maxWidth,   
  fontSize = 10,
  lineHeight = 1,
  options = {} 
) {
  if (!pdf || !text) return;

  const {
    scale = 1,
    fontName = 'Helvetica',
    fontStyle = 'normal',
    opacity = 0,
    charSpace = 0  
  } = options;

  const xPos = x * scale;
  const yPos = y * scale;
  const width = maxWidth * scale;

  const gState = new window.jspdf.GState({ opacity });
  pdf.saveGraphicsState();
  pdf.setGState(gState);

  pdf.setFont(fontName, fontStyle);
  pdf.setFontSize(fontSize);
  
  pdf.setCharSpace(charSpace);

  const cleanedText = String(text)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  if (cleanedText) {
    pdf.text(cleanedText, xPos, yPos, {
      maxWidth: width,
      lineHeightFactor: lineHeight
    });
  }

  pdf.restoreGraphicsState();
};





