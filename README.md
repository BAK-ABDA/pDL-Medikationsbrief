# Medikationsbrief – Webbasierter Prototyp

## Überblick

Dieses Projekt stellt eine **webbasierte Anwendung zur Erstellung eines Medikationsbriefs** bereit.  
Der Fokus liegt auf der einheitlichen, **strukturierten Erfassung personenbezogener und pharmazeutisch relevanter Informationen**, der **Dokumentation arzneimittelbezogener Probleme (ABP)** sowie der **generierten Ausgabe dieser Informationen als PDF-Dokument**.

Adressat der Inhalte des Medikationsbriefs ist der/die behandelnde Arzt/Ärztin.

Die Anwendung ist vollständig **clientseitig implementiert** (HTML, CSS, JavaScript) und kommt **ohne Backend** aus.  
Alle Eingaben werden lokal im Browser verarbeitet und, abhängig von der Konfiguration, lokal gespeichert.

---

## 📑 Inhaltsverzeichnis

- [Überblick](#überblick)
- [Funktionsumfang](#funktionsumfang)
  - [Allgemeine Formularstruktur](#1-allgemeine-formularstruktur)
  - [Sperr- und Freigabefunktion von Eingabefeldern](#2-sperr--und-freigabefunktion-von-eingabefeldern)
  - [Logos und Dateiuploads](#3-logos-und-dateiuploads)
  - [Auffälligkeiten / Diskrepanzen / ABP](#4-auffälligkeiten--diskrepanzen--abp)
  - [Patientenindividuelle Zusatzinformationen](#5-patientenindividuelle-zusatzinformationen)
  - [Datenquellen als Grundlage der Medikationsanalyse](#6-datenquellen-als-grundlage-der-medikationsanalyse)
  - [PDF-Generierung](#7-pdf-generierung)
- [Technischer Aufbau](#technischer-aufbau)
  - [Verwendete Technologien](#verwendete-technologien)
  - [Eingebundene Bibliotheken (lokal gehostet)](#eingebundene-bibliotheken-lokal-gehostet)
  - [JavaScript-Modulstruktur (Auszug)](#javascript-modulstruktur-auszug)
- [Datenschutz & Speicherung](#datenschutz--speicherung)
- [Ziel & Einordnung](#ziel--einordnung)
- [Lizenz & Hinweise](#lizenz--hinweise)

---

## Funktionsumfang

### 1. Allgemeine Formularstruktur

Die Oberfläche ist in logisch getrennte Abschnitte gegliedert:

- **Apothekeninformationen**
- **Kontaktinformationen**
- **Praxisinformationen**
- **Upload eines Apothekenlogos**
- **Auswahl, ob Auffälligkeiten/Diskrepanzen/ABP festgestellt wurden**
- **Personenbezogene Angaben zum/zur Patienten/Patientin**
- **Akuten Beschwerden/Symptomen und Nierenfunktion**
- **Arzneimittelbezogene Probleme und Lösungsvorschläge**
- **Datenquellen als Grundlage der Medikationsanalyse**
- **Upload eines Medikationsplans**

Die Eingabefelder sind überwiegend **dynamisch verknüpft**, sodass Inhalte an mehreren Stellen wiederverwendet werden (z. B. Anrede, Namen, geschlechterspezifische Sprache).

Datumsfelder sind einheitlich formatiert (**TT.MM.JJJJ**).

---

### 2. Sperr- und Freigabefunktion von Eingabefeldern

Einige Eingabefelder verfügen über ein **Schloss-Symbol**, mit dem Felder

- gesperrt oder
- wieder zur Bearbeitung freigegeben

werden können.

Gesperrte Felder bleiben gespeichert und sind vor unbeabsichtigten Änderungen geschützt  
(z. B. Apotheken- und Kontaktinformationen oder Logo).

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

### 4. Auffälligkeiten / Diskrepanzen / ABP

#### Auffälligkeiten / Diskrepanzen / ABP (Ja / Nein)

Über ein zentrales Umschaltelement wird festgelegt, ob

- **keine Auffälligkeiten/Diskrepanzen/ABP** oder
- **Auffälligkeiten/Diskrepanzen/ABP**

festgestellt wurden.

Die Auswahl steuert die Sichtbarkeit weiterer Eingabebereiche.

#### Arzneimittelbezogene Probleme und Lösungsvorschläge

- Auswahl vordefinierter Kategorien (Dropdown)
- Dynamisches Hinzufügen mehrerer Kategorien
- **Drag-and-Drop-Sortierung** der Kategorien
- Freitextfelder für Beschreibung und Lösungsvorschläge der jeweiligen Kategorie

---

### 5. Patientenindividuelle Zusatzinformationen

Erfasst werden können:

- Akute Beschwerden/Symptome
- Nierenfunktion inkl.:
  - bekannte Werte
  - Datum (TT.MM.JJJJ)
  - Quelle
  - Berücksichtigung bei der Medikationsprüfung  
    (inkl. erforderlicher Begründung, sofern Wert bekannt aber nicht berücksichtigt)

Die Checkbox-Gruppen sind logisch gekoppelt, sodass sich widersprüchliche Eingaben gegenseitig ausschließen.

---

### 6. Datenquellen als Grundlage der Medikationsanalyse

Dokumentation der Grundlage(n) der Medikationsanalyse, z. B.:

- Arzneimittelanamnese-Gespräch
- Brown-Bag-Analyse
- elektronische Medikationsliste (eML)
- Medikationsplan (BMP / eMP)
- Arztbriefe
- Sonstige Quellen

---

### 7. PDF-Generierung

Die Anwendung bietet folgende Funktionen:

- **Als PDF speichern**
- **Dokument anzeigen**
- **Dokument drucken**
- Entwurf speichern
- Entwurf öffnen
- Leeren

Die PDF-Erstellung erfolgt clientseitig auf Basis von:

- HTML-Rendering
- Canvas-Erzeugung
- Text-Overlays
- Positionskonfigurationen

Apothekenlogo, Texte, Auswahlfelder und strukturierte Inhalte werden korrekt im Dokument abgebildet.

---

## Technischer Aufbau

### Verwendete Technologien

- **HTML5 / CSS3**
- **JavaScript (Vanilla JS)**
- **keine Server- oder Backend-Abhängigkeiten**

---

### Eingebundene Bibliotheken (lokal gehostet)

- SortableJS – Drag & Drop
- Choices.js – erweiterte Dropdowns
- Flatpickr – Datumsauswahl (inkl. de-Lokalisierung)
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

Diese Anwendung dient als  
**referenzhafte produktive Umsetzung** eines Medikationsbrief-Werkzeugs im Apothekenkontext.

Alternative technische Implementierungen durch AVS sind möglich, sofern **Funktionalität, Fachlichkeit und Design** eingehalten werden.

---

## Lizenz & Hinweise

Der **Medikationsbrief®** ist ein eingetragenes Design der **ABDA**.
