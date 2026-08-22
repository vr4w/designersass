# Kommunikationskanal: Discord

Die erste Version nutzt bewusst nur Discord. Das Portal bleibt vorerst außen vor.

## Zielbild

Im DesignerSass gibt es einen Menüpunkt `Kontakt`. Dort kann ein Nutzer eine kurze Nachricht direkt in den DesignerSass-Discord-Kanal senden:

- Feedback
- Fehler melden
- Funktionswunsch
- aktive Vorlage und App-Version als Zusatzinformation

Technisch wird dafür zunächst ein Discord-Incoming-Webhook verwendet. Discord beschreibt Webhooks als HTTP-Endpunkte, über die Nachrichten direkt in einen Kanal gepostet werden können.

## Lokale Einrichtung

1. In Discord einen Webhook für den gewünschten Kanal erstellen.
2. `discord-config.example.js` als `discord-config.js` kopieren.
3. Die neue Webhook-Adresse ausschließlich in dieser lokalen Datei eintragen.
4. DesignerSass neu starten.

`discord-config.js` ist in `.gitignore` eingetragen und darf niemals in GitHub landen. Eine Webhook-Adresse ist wie ein Passwort: Wenn sie versehentlich veröffentlicht wurde, muss sie in Discord gelöscht und neu erstellt werden.

## Warum zunächst direkt zu Discord?

Für den privaten Familienbetrieb ist das der kleinste funktionierende Schritt: kein eigener Server, keine Benutzerkonten und kein Portal nötig. Für eine öffentliche Verteilung sollte später ein kleiner Relay-Dienst dazwischengeschaltet werden, damit der Webhook geheim bleibt und Spam geschützt werden kann.

## Spätere Admin-Zentrale

Das Admin-Portal bleibt eine spätere Option für:

- DesignerSass-Versionen und Update-Status
- Download- und Installationszahlen
- eingehende Nachrichten und Fehlerberichte
- MPRINT Helper: online/offline und letzte Verbindung
- weitere interne Tools und deren Status

Die Basisversion von DesignerSass bleibt vollständig lokal und sendet nichts automatisch. Discord wird nur verwendet, wenn der Nutzer selbst eine Nachricht abschickt.
