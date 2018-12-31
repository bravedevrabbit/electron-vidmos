const electron = require('electron');
const {app, BrowserWindow, ipcMain, dialog} = electron;

let mainWindow;
let createWindow = () => {
    mainWindow = new BrowserWindow({
        minHeight: 600,
        minWidth: 800,
        show: false,
        frame: (process.platform !== 'darwin') ? false : true,
        titleBarStyle: 'hidden'
    });
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.once('ready-to-show', () => mainWindow.show());

     
    mainWindow.webContents.send('is-maximized', mainWindow.isMaximized());
    mainWindow.on('maximize', () => mainWindow.webContents.send('is-maximized', mainWindow.isMaximized()));
    mainWindow.on('unmaximize', () => mainWindow.webContents.send('is-maximized', mainWindow.isMaximized()));
};

app.on('ready', createWindow);

app.on('activate', () => {
    if(mainWindow === null) createWindow();
});
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});

ipcMain.on('open-file', () => {
    dialog.showOpenDialog({
        title: 'Open Files',
        properties: ['openFile', 'multiSelections'],
        filters: [{name: 'Video Files', extensions: ['mp4', 'webm', 'ogg']}]
    }, (path) => console.log(path));
});

ipcMain.on('minimize', () => {
    mainWindow.minimize();
});

ipcMain.on('maximize', () => {
    if(mainWindow.isMaximized()){
        mainWindow.unmaximize();
    }else{
        mainWindow.maximize();
    }
});

ipcMain.on('exit', () => {
    if(process.platform !== 'darwin') app.quit();
});