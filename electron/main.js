const { app, BrowserWindow, dialog } = require("electron");
const { theSocialButterfly, messageToClient } = require("../public/puppeteer");
const { ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  ipcMain.on("anything-asynchronous", (event, obj) => {
    console.log("heyyyy", obj); // prints "heyyyy ping"

    theSocialButterfly(obj.mailOrPhone, obj.password, obj.keyword);
    event.reply("asynchronous-reply", "pong");
  });

  messageToClient.on("message", (data) => {
    // dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
    // (()=> dialog.showMessageBox({
    //     type:'info',
    //     title:'Errpr',
    //     message:data,
    //     buttons:['Howdy?','Alright']
    // }))()

    console.log(data);
    win.webContents.send("message", { msg: data });
  });
  
  messageToClient.on("restart", (data)=>{
    win.webContents.send("restart", {  });
  })
  
  messageToClient.on("countup", ()=>{
    
    win.webContents.send("countup", { msg:"countup" });
  })


  //load the index.html from a url
  // win.loadURL("http://localhost:3000");
  win.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);

  // Open the DevTools.
  // win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
