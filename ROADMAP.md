# DesignerSass Roadmap

## Aktueller Stand

- A4-Arbeitsflächen für Jewel Front, Jewel Back/Inlay und CD-Druckbogen
- getrennte Bildbestände je Vorlage
- Mehrfachimport mit Dateinamen-Zuordnung
- proportionales Einpassen ohne erzwungenen Zuschnitt
- Verschieben, Zoomen, Skalieren, Drehen und Spiegeln
- Einrasten an Zonen, Kanten und Mittellinien
- Bild entfernen per Button, Delete und Backspace
- Mausrad-Zoom, mittlere Maustaste als Handwerkzeug und direkte Eckgriffe zum proportionalen Skalieren
- Endprodukt-Vorschau mit abgedunkelten Bereichen außerhalb der Schnittflächen
- Präzises Verschieben per Pfeiltasten, mit Shift in größeren Schritten
- Originale PDF-Templates unter `assets/` eingebunden und vermessen
- Erster nativer PDF-Exportkern in `export_print_pdf.py`
- Electron-Desktop-Wrapper mit lokalem Exportkanal vorbereitet
- Windows-Buildskript für gebündelten PDF-Exporter und NSIS-/Portable-Ausgabe vorbereitet
- Discord-Kontaktfenster als lokaler MVP vorbereitet; Webhook-Konfiguration bleibt außerhalb des Repositories
- GitHub-Release-Workflow und automatische Update-Prüfung für Windows vorbereitet

## Direkter Arbeitsablauf

DesignerSass ist bewusst kein Projektverwaltungsprogramm. Der Ablauf ist: Vorlage wählen, Bilder einsetzen, bearbeiten, Druck-PDF vorbereiten und fertig. Keine verpflichtende Projektablage und kein Speichern-/Öffnen-System.

## Nächste Editor-Bausteine

1. Ersten Windows-Release mit Tag `v0.1.0` über GitHub Actions bauen.
2. Installer auf Mattis Laptop testen; danach Update mit `v0.1.1` prüfen.
3. Druckexport mit ausgeblendeten TEMPLATE-/INFO-Elementen und SCHNITT-Ausgabe.
4. Retusche-/Entfernen-Werkzeug als eigener Bildbearbeitungsmodus.
5. Verbesserte Bildausrichtung und kontrolliertes Einrasten an den Schnittflächen.

## Raspberry-Pi-Druckserver

- Raspberry Pi Zero 2 W als lokaler DesignerSass- und CUPS-Druckserver.
- Epson AL-C9200 zunächst per USB über den OTG-Anschluss testen.
- Treiberweg prüfen: Epson ESC/Page-Color V4, passende PPD, generisches PCL/PostScript oder CUPS/IPP.
- DesignerSass erzeugt die PDF auf dem Hauptrechner oder Server und übergibt sie an CUPS.
- Drucker- und Projektdaten getrennt vom Programmcode halten.
- Automatische GitHub-Aktualisierung erst nach lokalem Test und gesicherter Pi-Struktur einrichten.
