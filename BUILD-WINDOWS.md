# DesignerSass unter Windows bauen

Der Build wird auf einem Windows-11-Rechner ausgeführt. Dadurch entsteht eine
installierbare NSIS-Version und zusätzlich eine portable EXE.

Voraussetzungen:

- Node.js LTS
- Python 3.11 oder neuer, beim Installieren `Add Python to PATH` aktivieren
- PowerShell 5 oder neuer

Im Projektordner ausführen:

```powershell
npm install
npm run dist:win
```

Der Build erstellt:

- `dist/DesignerSass-0.1.0-x64-setup.exe` als Installer
- `dist/DesignerSass-0.1.0-x64-portable.exe` als portable Version

Der PDF-Exporter wird dabei in eine eigene `export_print_pdf.exe` umgewandelt
und zusammen mit den drei Originalvorlagen ausgeliefert. Auf Mattis Laptop
muss danach weder Python noch ein zusätzlicher PDF-Baustein installiert sein.
