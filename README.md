# DesignerSass

DesignerSass ist ein lokales CD-Cover-Studio für Jewel-Case-Cover, Inlays und CD-Direktaufkleber.

Der Schwerpunkt liegt auf einer verständlichen, professionellen Oberfläche für das Platzieren und Bearbeiten von Bildern auf echten A4-Druckvorlagen.

## Aktueller Stand

- A4-Vorlagen für Jewel Case Front, Jewel Case Back/Inlay und CD-Druckbogen
- Originale PDF-Templates unter `assets/`
- getrennte Bildbestände je Vorlage
- Mehrfachimport mit einfacher Dateinamen-Zuordnung
- proportional einpassen, Fläche füllen, skalieren, drehen und spiegeln
- freies Verschieben, Einrasten, Mausrad-Zoom und mittlere Maustaste als Handwerkzeug
- präzises Verschieben per Pfeiltasten
- Endprodukt-Vorschau
- nativer PDF-Exportkern mit SCHNITT-Ausgabe
- Electron-Desktop-Wrapper für den späteren Offline-Betrieb

## Lokal im Browser starten

Die Oberfläche kann weiterhin direkt über `index.html` geöffnet werden. Für den Desktop-Wrapper wird Electron verwendet.

```bash
npm install
npm start
```

## Windows-Version bauen

Der Windows-Build erzeugt eine installierbare und eine portable Version. Die vollständige Anleitung steht in [BUILD-WINDOWS.md](BUILD-WINDOWS.md).

```powershell
npm install
npm run dist:win
```

Der PDF-Exporter wird dabei zusammen mit den Vorlagen gebündelt. Auf dem Zielrechner muss Python nicht separat installiert werden.

## Projektprinzipien

- offline-first: DesignerSass soll ohne Internet funktionieren
- keine verpflichtende Projektverwaltung
- Vorlagen, Bilder und Druckausgabe bleiben voneinander getrennt
- Updates werden später über signierte GitHub-Releases verteilt
- externe Kommunikation und Telemetrie werden nur bewusst und opt-in ergänzt

## Roadmap

Die laufende Planung steht in [ROADMAP.md](ROADMAP.md). Der nächste Release-Schritt ist die Verbindung des Desktop-Wrappers mit automatischen GitHub-Updates.
