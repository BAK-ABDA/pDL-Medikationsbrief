function addTextOverlay(pdf, textBlocks, baseConfig) {
    if (!window.addSelectableText || !textBlocks) return;
    const {
        margin,
        currentY,
        yMultiplier = 1,
        yOffset = 0,
        xMultiplier = 1,
        xOffset = 0,
        fontSizeMultiplier = 0.69,
        lineHeight = 1.4,
        defaultOpacity = 0,
        charSpace = null,
        customLogic = null,
        pixelToMM
    } = baseConfig;
    
    for (let i = 0; i < textBlocks.length; i++) {
        const block = textBlocks[i];
        const prevBlock = textBlocks[i - 1];
        
        let xPos = margin * xMultiplier + pixelToMM(block.x * (customLogic?.xBlockMultiplier || 1)) + xOffset;
        let yPos = currentY * yMultiplier + pixelToMM(block.y * (customLogic?.yBlockMultiplier || 1)) + yOffset;
        
        if (customLogic?.processBlock) {
            const adjusted = customLogic.processBlock(block, xPos, yPos, margin, currentY, prevBlock);
            if (adjusted === null) continue;
            xPos = adjusted.xPos;
            yPos = adjusted.yPos;
        }
        
        const isBold =
            block.fontWeight === 'bold' ||
            block.fontWeight === 'bolder' ||
            parseInt(block.fontWeight) >= 700;
        
        const options = {
            fontStyle: isBold ? 'bold' : 'normal',
            opacity: defaultOpacity
        };
        
        if (charSpace !== null) {
            options.charSpace = charSpace;
        }
        
        if (customLogic?.getExtraOptions) {
            Object.assign(options, customLogic.getExtraOptions(block));
        }
        
        window.addSelectableText(
            pdf,
            block.text,
            xPos,
            yPos,
            pixelToMM(block.width*0.9),
            Math.max(8, block.fontSize * fontSizeMultiplier),
            lineHeight,
            options
        );
    }
}
window.addTextOverlay = addTextOverlay;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { addTextOverlay };
}
