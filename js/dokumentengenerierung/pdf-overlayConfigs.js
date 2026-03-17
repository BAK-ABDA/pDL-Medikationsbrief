const REGEX = {
    CHECKBOX_PREFIX: /^[☑☐&]\s*/,
    LETTER_SPACING: /A r z t b r i e f e s|S o n s t i g e s/
};

const TEXT_SETS = {
    MEDIKATION_LONG_CHECKBOX: new Set([
        'Der Medikationsbrief ist zur Kenntnisnahme.',
        'Es besteht ggf. Handlungsbedarf.'
    ]),
    
    INFO_ROW_CHECKBOX: new Set([
        'nicht bekannt',
        'keine',
        'folgende:',
        'nicht berücksichtigt',
        'berücksichtigt'
    ]),
    
    INFO_ROW_HEADLINES: new Set([
        'Akute Beschwerden/Symptome',
        'Nierenfunktion'
    ]),
    
    PROBLEM_STATIC_CATEGORIES: new Set([
        'Mögliche Interaktionen/Symptome aufgrund von Interaktionen',
        'Berichtete Nebenwirkungen',
        'Probleme, die die Auswahl des Arzneimittels betreffen',
        'Probleme, die die Dosierung und Therapiedauer betreffen',
        'Probleme, die die Darreichungsform der Arzneimittel betreffen'
    ])
};

const LOOKUPS = {
    GENDER_OFFSETS: {
        'w': -14.5,
        'm': -16.5,
        'd': -18.5
    }
};

const SPECIAL_TEXTS = {
    NIERENFUNKTION: 'Diese Nierenfunktion wurde bei der Prüfung der Medikation',
    QUELLE: 'Quelle:'
};

// HILFSFUNKTIONEN

/**
 * Prüft ob Text eine Kategorie-Überschrift ist
 * @param {string} text - Bereits getrimmter Text
 * @returns {boolean}
 */
function isCategoryHeader(text) {
    if (TEXT_SETS.PROBLEM_STATIC_CATEGORIES.has(text)) {
        return true;
    }
    
    return text.startsWith('Zusätzlich relevante Informationen');
}

/**
 * Prüft ob Text eine Überschrift enthält (Footer)
 * @param {string} text - Bereits getrimmter Text
 * @returns {boolean}
 */
function isFooterHeadline(text) {
    return text.includes('Analyse der Medikation auf Grundlage') ||
           text.includes('Medikationsplan im Anhang');
}

/**
 * Prüft ob Text zur zweiten Box gehört (Footer)
 * @param {string} text - Bereits getrimmter Text
 * @returns {boolean}
 */
function isSecondBox(text) {
    return text.includes('Medikationsplan im Anhang') ||
           text.includes('Medikationsplan (aktualisiert durch Apotheke am');
}

const overlayConfigs = {
    title: {
        xMultiplier: 0.37,
        yMultiplier: 1.25,
        fontSizeMultiplier: 0.64,
        defaultOpacity: 0,
        customLogic: {
            getExtraOptions: () => ({ fontStyle: 'bold' })
        }
    },

    institution: {
        yMultiplier: 1.10625,
        fontSizeMultiplier: 0.65,
        lineHeight: 1.1,
        defaultOpacity: 0,
        charSpace: 0.025,
        customLogic: {
            yBlockMultiplier: 0.86,
            processBlock: (block, xPos, yPos, margin, currentY, extraParams) => {
                const { pixelToMM } = extraParams;
                const rightColumnStart = 340;
                
                if (block.x < rightColumnStart) {
                    xPos = margin + pixelToMM(block.x);
                } else {
                    xPos = margin + 75 + pixelToMM(block.x - rightColumnStart);
                }
                
                return { xPos, yPos };
            }
        }
    },

    medikationsberatung: {
        yMultiplier: 1.025,
        fontSizeMultiplier: 0.67,
        defaultOpacity: 0,
        charSpace: -0.055,
        customLogic: {
            yBlockMultiplier: 0.86,
            processBlock: (block, xPos, yPos) => {
                const xShift = -0.625;
                const yShift = 0.655;
                const trimmedText = block.text.trim();

                const longCheckboxOffset = TEXT_SETS.MEDIKATION_LONG_CHECKBOX.has(trimmedText) ? -1 : 0;

                const dynamicCheckboxOffset = LOOKUPS.GENDER_OFFSETS[trimmedText] ?? 0;

                const checkboxOffsetMM = longCheckboxOffset + dynamicCheckboxOffset;

                return {
                    xPos: xPos + xShift + checkboxOffsetMM,
                    yPos: yPos + yShift,
                    maxWidth: block.maxWidth - xShift
                };
            }
        }
    },

    infoRow: {
        xMultiplier: 0.95,
        yMultiplier: 1.0195,
        fontSizeMultiplier: 0.69,
        defaultOpacity: 0,
        customLogic: {
            yBlockMultiplier: 0.8625,
            processBlock: (block, xPos, yPos, margin, currentY, extraParams) => {
                const { contentWidth } = extraParams;
                const trimmedText = block.text.trim();
                
                const isRightColumn = block.x > contentWidth / 2;
                const rightColumnOffsetMM = isRightColumn ? -15.25 : 0;
                
                const checkboxOffsetMM = TEXT_SETS.INFO_ROW_CHECKBOX.has(trimmedText) ? -1 : 0;
                
                const quelleOffsetMM = trimmedText === SPECIAL_TEXTS.QUELLE ? -5.5 : 0;
                
                xPos += rightColumnOffsetMM + quelleOffsetMM + checkboxOffsetMM;
                
                return { xPos, yPos };
            },
            getExtraOptions: (block) => {
                const trimmedText = block.text.trim();
                const isHeadline = TEXT_SETS.INFO_ROW_HEADLINES.has(trimmedText);
                
                const options = {};
                
                if (trimmedText === SPECIAL_TEXTS.NIERENFUNKTION) {
                    options.charSpace = -0.1;
                } else if (!isHeadline) {
                    options.charSpace = -0.06;
                }
                
                return options;
            }
        }
    },

    problemHeader: {
        yMultiplier: 1.02,
        fontSizeMultiplier: 0.6425,
        defaultOpacity: 0,
        customLogic: {
            yBlockMultiplier: 1.4,
            getExtraOptions: () => ({ fontStyle: 'bold' })
        }
    },

    problemEntry: {
        yMultiplier: 0.9,
        fontSizeMultiplier: 0.65,
        lineHeight: 1.15,
        defaultOpacity: 0,
        charSpace: 0.0,
        customLogic: {
            lastWasCategory: false, 

            processBlock: function (block, xPos, yPos, margin, currentY, extraParams) {
                const { pixelToMM } = extraParams;
                const trimmedText = block.text.trim();
                
                const isCategory = isCategoryHeader(trimmedText);

                let yOffset;
                
                if (isCategory) {
                    yOffset = 1.85;
                    this.lastWasCategory = true;
                } else if (this.lastWasCategory) {
                    yOffset = 0.5; 
                    this.lastWasCategory = false;
                } else {
                    yOffset = 1.85;
                }

                const absoluteY = currentY + yOffset + pixelToMM(block.y);

                return { 
                    xPos: xPos - 1, 
                    yPos: absoluteY 
                };
            },

            getExtraOptions: function (block) {
                const trimmedText = block.text.trim();
                const isCategory = isCategoryHeader(trimmedText);

                return { 
                    fontStyle: isCategory ? 'bold' : 'normal'
                };
            }
        }
    },

    footer: {
        xMultiplier: 0.97,
        yMultiplier: 1.010375,
        fontSizeMultiplier: 0.69,
        defaultOpacity: 0,
        customLogic: {
            yBlockMultiplier: 0.95,
            processBlock: (block, xPos, yPos, margin, currentY) => {
                const trimmedText = block.text.trim();
                
                if (trimmedText === '&' || trimmedText === '☑' || trimmedText === '☐') {
                    return null;
                }
                
                const startsWithCheckbox = REGEX.CHECKBOX_PREFIX.test(trimmedText);
                const checkboxOffsetMM = startsWithCheckbox ? 4 : 0;
                
                const isHeadline = isFooterHeadline(trimmedText);
                const isSecondBoxText = isSecondBox(trimmedText);
                
                let headlineYOffset = 0;
                if (isHeadline) {
                    headlineYOffset = 2;
                    if (isSecondBoxText) {
                        headlineYOffset -= 1.15;
                    }
                }
                
                xPos += checkboxOffsetMM;
                yPos += headlineYOffset;
                
                if (startsWithCheckbox) {
                    block.text = trimmedText.replace(REGEX.CHECKBOX_PREFIX, '');
                }
                
                return { xPos, yPos };
            },
            getExtraOptions: (block) => {
                const cleanedText = block.text.trim();
                const options = {};
                
                if (REGEX.LETTER_SPACING.test(cleanedText)) {
                    options.charSpace = -0.5;
                    return options;
                }
            
                if (isFooterHeadline(cleanedText)) {
                    options.charSpace = 0.225;
                    options.fontWeight = 'bold';
                    return options;
                }
                
                options.charSpace = 0.009;
                return options;
            }
        }
    }
};

/**
 * Wendet Text-Overlay auf PDF basierend auf vordefinierter Konfiguration an
 * @param {Object} pdf - jsPDF Instanz
 * @param {Object} result - Ergebnis von createAndRenderHTMLWithText (mit textBlocks)
 * @param {string} section - Name der Sektion (z.B. 'title', 'institution', etc.)
 * @param {Object} baseParams - Basis-Parameter (margin, currentY, pixelToMM, etc.)
 */
function applyTextOverlay(pdf, result, section, baseParams) {
    if (!result.textBlocks || !window.addTextOverlay) {
        return;
    }

    const config = overlayConfigs[section];
    if (!config) {
        console.warn(`Keine Overlay-Konfiguration für Sektion '${section}' gefunden`);
        return;
    }

    const enhancedCustomLogic = config.customLogic ? {
        ...config.customLogic,
        processBlock: config.customLogic.processBlock 
            ? (block, xPos, yPos, margin, currentY) => {
                return config.customLogic.processBlock(block, xPos, yPos, margin, currentY, baseParams);
            }
            : undefined
    } : undefined;

    const overlayConfig = {
        ...baseParams,
        ...config,
        customLogic: enhancedCustomLogic
    };

    window.addTextOverlay(pdf, result.textBlocks, overlayConfig);
}

window.applyTextOverlay = applyTextOverlay;
window.overlayConfigs = overlayConfigs;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { applyTextOverlay, overlayConfigs };
}