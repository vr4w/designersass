const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: '#151a20',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false },
  });
  window.loadFile(path.join(__dirname, '..', 'index.html'));
}

function pythonCommand() {
  if (process.platform === 'win32') return { command: 'python', args: [] };
  if (process.platform === 'darwin' && process.arch === 'arm64') return { command: 'arch', args: ['-x86_64', 'python3'] };
  return { command: 'python3', args: [] };
}

ipcMain.handle('export-pdf', async (_event, payload) => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'designersass-'));
  const placementsPath = path.join(tempRoot, 'placements.json');
  const outputPath = path.join(tempRoot, `DesignerSass-${payload.template}.pdf`);
  fs.writeFileSync(placementsPath, JSON.stringify(payload.placements), 'utf8');
  const script = app.isPackaged
    ? path.join(process.resourcesPath, 'export_print_pdf.exe')
    : path.join(app.getAppPath(), 'export_print_pdf.py');
  const python = pythonCommand();
  const command = app.isPackaged ? script : python.command;
  const args = app.isPackaged ? [payload.template, placementsPath, outputPath] : [...python.args, script, payload.template, placementsPath, outputPath];
  const exportRoot = app.isPackaged ? process.resourcesPath : app.getAppPath();
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: exportRoot,
      env: { ...process.env, DESIGNERSASS_ROOT: exportRoot },
    });
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', (error) => reject(new Error(`PDF-Export konnte nicht gestartet werden: ${error.message}`)));
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(stderr || `PDF-Export beendet mit Code ${code}`));
      dialog.showSaveDialog({
        title: 'DesignerSass PDF speichern',
        defaultPath: path.join(app.getPath('documents'), `DesignerSass-${payload.template}.pdf`),
        filters: [{ name: 'PDF', extensions: ['pdf'] }],
      }).then(({ canceled, filePath }) => {
        if (canceled || !filePath) return resolve({ canceled: true });
        fs.copyFileSync(outputPath, filePath);
        fs.rmSync(tempRoot, { recursive: true, force: true });
        resolve({ path: filePath, filename: path.basename(filePath) });
      }).catch(reject);
    });
  });
});

ipcMain.handle('send-discord', async (_event, { webhookUrl, payload }) => {
  if (!webhookUrl || !payload) throw new Error('Discord ist nicht eingerichtet.');
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Discord antwortet mit ${response.status}`);
  return { ok: true };
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
