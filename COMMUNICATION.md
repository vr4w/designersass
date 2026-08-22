# Kommunikationskanal und Admin-Zentrale

Die Idee ist sinnvoll, sollte aber getrennt vom eigentlichen Editor aufgebaut werden.

## Zielbild

In DesignerSass gibt es später einen Menüpunkt `Kontakt`. Dort kann ein Nutzer eine kurze Nachricht schreiben und freiwillig technische Angaben mitsenden:

- App-Version
- Betriebssystem
- aktive Vorlage
- optional eine Fehlerbeschreibung

Die Nachricht wird an einen zentralen DesignerSass-Dienst gesendet. Das bestehende Admin-Portal kann diese Nachrichten als Eingang anzeigen.

## Warum nicht direkt per E-Mail aus der App?

Eine direkte Mailfunktion wäre zunächst einfacher, aber schlecht kontrollierbar: Spam-Schutz, Absender, Mailserver und Datenschutz würden in jede Client-App wandern. Ein zentraler Eingang ist zuverlässiger.

## Spätere Admin-Zentrale

Das Admin-Portal könnte langfristig mehrere lokale Apps verbinden:

- DesignerSass-Versionen und Update-Status
- Download- und Installationszahlen
- eingehende Nachrichten und Fehlerberichte
- MPRINT Helper: online/offline und letzte Verbindung
- weitere interne Tools und deren Status

Das sollte zunächst als bewusstes Dashboard mit opt-in Telemetrie gebaut werden. Die Basisversion von DesignerSass bleibt vollständig lokal und sendet nichts automatisch.
