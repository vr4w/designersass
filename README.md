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
- Kontaktfenster für freiwillige Nachrichten an einen Discord-Kanal

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

## Updates über GitHub

Die installierte Windows-Version prüft beim Start — nur wenn sie als Desktop-App installiert wurde — nach einem GitHub-Release. Gibt es ein neues Release, wird es im Hintergrund geladen und DesignerSass fragt vor dem Neustart nach. Ohne Internet läuft die App normal weiter.

Ein Release wird durch einen Tag wie `v0.1.1` ausgelöst. Der Windows-Build läuft dann automatisch über GitHub Actions und legt Installer sowie Update-Dateien am Release ab.

## Projektprinzipien

- offline-first: DesignerSass soll ohne Internet funktionieren
- keine verpflichtende Projektverwaltung
- Vorlagen, Bilder und Druckausgabe bleiben voneinander getrennt
- Updates werden später über signierte GitHub-Releases verteilt
- externe Kommunikation und Telemetrie werden nur bewusst und opt-in ergänzt

## Discord-Kontakt einrichten

Für den privaten Testbetrieb kann das Kontaktfenster Nachrichten an einen Discord-Kanal senden. Kopiere `discord-config.example.js` zu `discord-config.js` und trage dort den Webhook ein. Die lokale Konfigurationsdatei wird nicht versioniert. Eine veröffentlichte oder versehentlich geteilte Webhook-Adresse muss sofort in Discord gelöscht und neu erstellt werden.

## Roadmap

Die laufende Planung steht in [ROADMAP.md](ROADMAP.md). Der nächste Release-Schritt ist die Verbindung des Desktop-Wrappers mit automatischen GitHub-Updates.
