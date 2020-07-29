const { promisify } = require('util');
const fs = require('fs');
const path = require('path'); 
const convert = require('heic-convert');

const fileUpload = document.getElementById('filePath');
const fileName = document.getElementById('fileName');
const themeNameBtn = document.getElementById('themeNameBtn');
const processBtn = document.getElementById('btnProcess');
const dissapearWarning = document.getElementById('dissapearWarning');
const dissapearSuccess = document.getElementById('dissapearSuccess');

let filePath = null;
let themeName = null;
let defaultConfig = {
    "imageFilename": "Catalina_*.jpg",
    "imageCredits": "Apple",
    "sunriseImageList": [
        1
    ],
    "dayImageList": [
        2
    ],
    "sunsetImageList": [
        3
    ],
    "nightImageList": [
        4
    ]
  };

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

// Inputs
themeNameBtn.onkeyup = () => {
    themeName = themeNameBtn.value;
}

// Buttons
processBtn.onclick = () => {
    console.log("Process Start" + filePath);
    processFile(filePath).then(() => {
        document.getElementById('successMessage').classList.remove(["dissapear"]);
      });
}

dissapearWarning.onclick = () => {
    document.getElementById('warningMessage').classList.add(["dissapear"]);
}

dissapearSuccess.onclick = () => {
    document.getElementById('successMessage').classList.add(["dissapear"]);
}

// Process the file
async function processFile(filePath) {
    const inputBuffer = await promisify(fs.readFile)(filePath);
    const images = await convert.all({
      buffer: inputBuffer,
      format: 'JPEG'
    });

    defaultConfig.imageFilename = themeName+"_*.jpg"

    fs.mkdir(path.join(__dirname+"/output", themeName), (err) => { 
        if (err) { 
            return console.error(err); 
        } 
        console.log('Directory created successfully!'); 
    }); 
   
    for (let idx in images) {
      const image = images[idx];
      const outputBuffer = await image.convert();
      await promisify(fs.writeFile)(`./output/${themeName}/${themeName}_${parseInt(idx)+1}.jpg`, outputBuffer);
    }

    let data = JSON.stringify(defaultConfig);
    fs.writeFileSync('./output/'+themeName+'/theme.json', data);
    
};