
const {BrowserWindow, ipcMain,  Menu, shell, app, webContents} = require('electron');

const path = require('path')
let win;
 
require('electron-reload')(__dirname+'/mian.js', {
  electron: require('${__dirname}/../../node_modules/electron')
 // , hardResetMethod: 'exit'
});

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
  /*  width: 117, 
    height: 30,
    transparent:true,
    frame:false,
   // type:"toolbar",
    alwaysOnTop:true,
    resizable:true,
    icon: `file://${__dirname}/dist/assets/logo.png`,
    autoHideMenuBar: true,
    fullscreenable: false,
    show: false,    //先不让窗口显示
    webPreferences: {
        javascript: true,
        plugins: true,
        devTools: true, //关闭调试工具
        nodeIntegration: false, // 不集成 Nodejs
        webSecurity: false,
        preload: path.join(__dirname, './public/renderer.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    }*/
    width: 107, //悬浮窗口的宽度 比实际DIV的宽度要多2px 因为有1px的边框
    height: 27, //悬浮窗口的高度 比实际DIV的高度要多2px 因为有1px的边框
    type: 'toolbar',    //创建的窗口类型为工具栏窗口
    frame: false,   //要创建无边框窗口
    resizable: true, //禁止窗口大小缩放
    show: false,    //先不让窗口显示
    webPreferences: {
        devTools: false, //关闭调试工具
        preload: path.join(__dirname, './public/renderer.js')
    },
    transparent: true,  //设置透明
    alwaysOnTop: true,  //窗口是否总是显示在其他窗口之前
  })
  //win.loadURL(`file://${__dirname}/dist/angular-electron/index.html`)
  win.loadURL(`http://localhost:3000`);
  //win.setIgnoreMouseEvents(true);
  // uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  app.win=win;


  //设置窗口的位置 注意x轴要桌面的宽度 - 窗口的宽度
  win.on('closed', function () {
    win = null
  })

  win.once('ready-to-show', () => {
      console.log('ready to show');
      const  {screen}= require('electron');
      const size = screen.getPrimaryDisplay().workAreaSize;   //获取显示器的宽高
      const winSize = win.getSize();  //获取窗口宽高
      win.setPosition(size.width - winSize[0], 100);
      win.show()
      window = BrowserWindow.fromWebContents(webContents.getFocusedWebContents())
  });

  let window ;
  ipcMain.on('showSuspensionWindow', () => {
    if (win) {
        if (win.isVisible()) {
            createSuspensionWindow();
        } else {
            win.showInactive();
        }
    } else {
    }

});

ipcMain.on('createSuspensionMenu', (e) => {
    const rightM = Menu.buildFromTemplate([
        {label: '开始全部任务', enabled: false},
        {label: '暂停全部任务', enabled: false},
        {label: '本次传输完自动关机'},
        {type: 'separator'},
        {
            label: '隐藏悬浮窗',
            click: () => {
                window.webContents.send('hideSuspension', false);
                win.hide()
            }
        },
        {type: 'separator'},
        {
            label: '加入qq群',
            click: () => {
                shell.openExternal('tencent://groupwpa/?subcmd=all&param=7B2267726F757055696E223A3831343237303636392C2274696D655374616D70223A313533393531303138387D0A');
            }
        },
        {
            label: 'GitHub地址',
            click: () => {
                shell.openExternal('https://github.com/lihaotian0607/auth');
            }
        },
        {
            label: '退出软件',
            click: () => {
                app.quit();
            }
        },
    ]);
    rightM.popup({});
});

}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})