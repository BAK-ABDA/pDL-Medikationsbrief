# Medikationsbrief – Webbasierter Prototyp

### Inhaltsverzeichnis
- [Überblick](#überblick)
- [Funktionsumfang](#funktionsumfang)
    - [1. Allgemeine Formularstruktur](#1-allgemeine-formularstruktur)
    - [2. Sperr- und Freigabefunktion von Eingabefeldern](#2-sperr--und-freigabefunktion-von-eingabefeldern)
    - [3. Logos und Dateiuploads](#3-logos-und-dateiuploads)
    - [4. Auffälligkeiten & arzneimittelbezogene Probleme](#4-auffälligkeiten--arzneimittelbezogene-probleme)
    - [5. Medizinische Zusatzinformationen](#5-medizinische-zusatzinformationen)
    - [6. Analysegrundlagen](#6-analysegrundlagen)
    - [7. PDF-Generierung](#7-pdf-generierung)
- [Technischer Aufbau](#technischer-aufbau)
    - [Verwendete Technologien](#verwendete-technologien)
    - [Eingebundene Bibliotheken (lokal gehostet)](#eingebundene-bibliotheken-lokal-gehostet)
    - [JavaScript-Modulstruktur (Auszug)](#javascript-modulstruktur-auszug)
- [Datenschutz & Speicherung](#datenschutz--speicherung)
- [Ziel & Einordnung](#ziel--einordnung)
- [Lizenz & Hinweise](#lizenz--hinweise)

---

## Überblick
Dieses Projekt stellt eine **webbasierte Anwendung zur Erstellung eines Medikationsbriefs** bereit.  
Der Fokus liegt auf der **strukturierten Erfassung medizinisch relevanter Informationen**, der **Dokumentation arzneimittelbezogener Probleme** sowie der **generierten Ausgabe als PDF-Dokument**.

Die Anwendung ist vollständig **clientseitig implementiert** (HTML, CSS, JavaScript) und kommt **ohne Backend** aus.  
Alle Eingaben werden lokal im Browser verarbeitet und – abhängig von der Konfiguration – lokal gespeichert.

---

## Funktionsumfang

### 1. Allgemeine Formularstruktur
Die Oberfläche ist in logisch getrennte Abschnitte gegliedert:

- **Apothekeninformationen**
- **Praxisinformationen**
- **Kontaktinformationen**
- **Patientenbezogene Angaben**
- **Medikationsberatungstext**
- **Auffälligkeiten / Diskrepanzen**
- **Arzneimittelbezogene Probleme**
- **Analysegrundlagen**
- **Upload eines Medikationsplans (PDF)**

Die Eingabefelder sind überwiegend **dynamisch verknüpft**, sodass Inhalte an mehreren Stellen wiederverwendet werden  
(z. B. Anrede, Namen, geschlechterspezifische Sprache).

---

### 2. Sperr- und Freigabefunktion von Eingabefeldern
Viele Eingabefelder verfügen über ein **Schloss-Symbol**, mit dem Felder:

- gesperrt oder
- wieder zur Bearbeitung freigegeben

werden können.

Gesperrte Felder bleiben gespeichert und sind vor unbeabsichtigten Änderungen geschützt  
(z. B. Stammdaten wie Apothekenname, Kontaktdaten oder Logo).

---

### 3. Logos und Dateiuploads

#### Apothekenlogo
- Upload beliebiger Bildformate
- Vorschau im Formular
- Integration in das generierte PDF

#### Medikationsplan
- Upload als PDF-Datei
- Dateiübersicht mit Entfernen-Funktion

Alle Dateien werden ausschließlich **lokal verarbeitet**.

---

### 4. Auffälligkeiten & arzneimittelbezogene Probleme

#### Auffälligkeiten (Ja / Nein)
Über ein zentrales Umschaltelement wird festgelegt, ob:

- **keine Auffälligkeiten** oder
- **Auffälligkeiten / ABP**

festgestellt wurden.

Die Auswahl steuert die Sichtbarkeit weiterer Eingabebereiche.

#### Arzneimittelbezogene Probleme
- Auswahl vordefinierter Problemkategorien (Dropdown)
- Dynamisches Hinzufügen mehrerer Kategorien
- **Drag-and-Drop-Sortierung** der Kategorien
- Freitextfelder für Beschreibung und Lösungsvorschläge

---

### 5. Medizinische Zusatzinformationen
Erfasst werden u. a.:

- Akute Beschwerden / Symptome
- Nierenfunktion inkl.:
    - bekannte Werte
    - Datum
    - Quelle
    - Berücksichtigung bei der Medikationsprüfung (inkl. Begründung)

Checkbox-Gruppen sind logisch gekoppelt, sodass sich widersprüchliche Eingaben gegenseitig ausschließen.

---

### 6. Analysegrundlagen
Dokumentation der Grundlage(n) der Medikationsanalyse, z. B.:

- Arzneimittelanamnese-Gespräch
- Brown-Bag-Analyse
- elektronische Medikationsliste (eML)
- Medikationsplan (BMP / eMP)
- Arztbriefe
- Sonstige Quellen

Datumsfelder sind einheitlich formatiert (**TT.MM.JJJJ**).

---

### 7. PDF-Generierung
Die Anwendung bietet folgende Funktionen:

- **Dokument anzeigen**
- **Als PDF speichern**
- **Drucken**

Die PDF-Erstellung erfolgt clientseitig auf Basis von:

- HTML-Rendering
- Canvas-Erzeugung
- Text-Overlays
- Positionskonfigurationen

Logo, Texte, Auswahlfelder und strukturierte Inhalte werden korrekt im Dokument abgebildet.

---

## Technischer Aufbau

### Verwendete Technologien
- **HTML5 / CSS3**
- **JavaScript (Vanilla JS)**
- **keine Server- oder Backend-Abhängigkeiten**

### Eingebundene Bibliotheken (lokal gehostet)
- SortableJS – Drag & Drop
- Choices.js – erweiterte Dropdowns
- Flatpickr – Datumsauswahl (inkl. de‑Lokalisierung)
- DOMPurify – Sanitizing von Eingaben
- html2canvas – HTML-Rendering
- jsPDF – PDF-Erzeugung
- html2pdf.js – kombinierte PDF-Pipeline
- PDF.js – Vorschau / Verarbeitung von PDFs

Alle externen Abhängigkeiten werden **lokal eingebunden**, um Datenschutz- und Offline-Anforderungen zu erfüllen.

---

### JavaScript-Modulstruktur (Auszug)
- Formularinteraktionen und Validierung
- Szenarien- und Zustandsverwaltung
- Lokale Persistierung von Feldern
- Geschlechterspezifische Textlogik
- Logo- und PDF-Preview
- Dokumentengenerierung:
    - Datenerfassung
    - Textgenerierung
    - Overlay-Konfiguration
    - PDF-Export

Die Struktur ist modular aufgebaut und auf Erweiterbarkeit ausgelegt.

---

## Datenschutz & Speicherung
- Alle Daten verbleiben **ausschließlich lokal im Browser**
- Keine Netzwerkübertragung
- Keine Server-Kommunikation
- Keine Nutzer-Tracking-Mechanismen

Geeignet für den Einsatz in **datenschutzsensiblen Umgebungen**.

---

## Ziel & Einordnung
Diese Anwendung dient als:

- mögliche produktive Umsetzung eines Medikationsbrief-Werkzeugs im Apothekenkontext

---

## Lizenz & Hinweise
**Medikationsbrief®** ist eine eingetragene Marke der **ABDA**.  
Dieses Projekt dient ausschließlich **Demonstrations- und Konzeptionszwecken**.