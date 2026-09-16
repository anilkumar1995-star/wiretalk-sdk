const { app, BrowserWindow, ipcMain, desktopCapturer, screen } = require('electron');
const path = require('path');
const { handleInputEvent } = require('./input-bridge');

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 460,
        height: 560,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('capture-primary-source', async () => {
    const primary = screen.getPrimaryDisplay();
    const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 320, height: 180 },
    });

    const match = sources.find((source) => source.display_id === String(primary.id))
        || sources[0];

    if (!match) {
        throw new Error('No screen source available.');
    }

    return {
        id: match.id,
        name: match.name,
    };
});

ipcMain.handle('inject-input', async (_event, payload) => {
    await handleInputEvent(payload, screen.getPrimaryDisplay());
    return { ok: true };
});
