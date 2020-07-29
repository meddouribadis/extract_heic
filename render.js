const { desktopCapturer } = require("electron")

const fileUpload = document.getElementById('filePath');
const fileName = document.getElementById('fileName');
const themeNameBtn = document.getElementById('themeNameBtn');
const processBtn = document.getElementById('btnProcess');
let filePath = null;
let themeName = null;

// File Upload
document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();

    filePath = e.dataTransfer.files[0].path;
    fileName.innerText = e.dataTransfer.files[0].name;
    processBtn.disabled = false;
    for (const f of e.dataTransfer.files) {
        console.log('File(s) you dragged here: ', f.path)
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

fileUpload.onchange = () => {
    if(fileUpload.files[0] !== undefined){
        filePath = fileUpload.files[0].path;
        fileName.innerText = fileUpload.files[0].name;
        processBtn.disabled = false;
        console.log(fileUpload.files[0].path);
    }
}