const { promisify } = require('util');
const fs = require('fs');
const convert = require('heic-convert');

const fileUpload = document.getElementById('filePath');
const fileName = document.getElementById('fileName');
const themeNameBtn = document.getElementById('themeNameBtn');
const processBtn = document.getElementById('btnProcess');
const dissapearWarning = document.getElementById('dissapearWarning');

let filePath = null;
let themeName = null;

// File Upload
document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if(e.dataTransfer.files[0].type === "image/heic"){
        filePath = e.dataTransfer.files[0].path;
        fileName.innerText = e.dataTransfer.files[0].name;
        processBtn.disabled = false;
        for (const f of e.dataTransfer.files) {
            console.log('File(s) you dragged here: ', f.path)
        }
    }
    else {
        document.getElementById('warningMessage').classList.remove(["dissapear"]);
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

// Buttons
processBtn.onclick = () => {
    console.log("Process Start" + filePath);
    processFile(filePath);
}

dissapearWarning.onclick = () => {
    document.getElementById('warningMessage').classList.add(["dissapear"]);
}

// Process the file
async function processFile(filePath) {
    const inputBuffer = await promisify(fs.readFile)(filePath);
    const images = await convert.all({
      buffer: inputBuffer, // the HEIC file buffer
      format: 'JPEG'       // output format
    });
   
    for (let idx in images) {
      const image = images[idx];
      const outputBuffer = await image.convert();
      await promisify(fs.writeFile)(`./output/result-${idx}.jpg`, outputBuffer);
    }
};