$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$venv = Join-Path $root '.venv-export'
$dist = Join-Path $root 'dist-pdf'

if (-not (Test-Path $venv)) {
  py -3 -m venv $venv
}

$python = Join-Path $venv 'Scripts/python.exe'
& $python -m pip install --upgrade pip
& $python -m pip install -r (Join-Path $root 'requirements-export.txt')

if (Test-Path $dist) {
  Remove-Item $dist -Recurse -Force
}
New-Item -ItemType Directory -Path $dist | Out-Null

& $python -m PyInstaller --noconfirm --clean --onefile `
  --name export_print_pdf `
  --distpath $dist `
  --workpath (Join-Path $root 'tmp/pyinstaller') `
  --specpath (Join-Path $root 'tmp/pyinstaller') `
  (Join-Path $root 'export_print_pdf.py')

Write-Host "PDF-Exporter erstellt: $dist/export_print_pdf.exe"
