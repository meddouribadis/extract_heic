const { app, BrowserWindow } = require('electron');

global.sharedObject = {
    themeName: null,
}

function createWindow () {
   const win = new BrowserWindow({
    width: 800,
    height: 650,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('./src/index.html')
}
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
