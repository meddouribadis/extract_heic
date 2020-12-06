const { shell, remote } = require('electron');
const app = remote.app;
const fs = require('fs');
const path = require('path');
const regex = /(?<=\_)(.*?)(?=\.jpg)/gm;
const fileList = {}

let defaultConfig = {
    "imageFilename": "Catalina_*.jpg",
    "imageCredits": "Apple",
    "sunriseImageList": [
    ],
    "dayImageList": [
    ],
    "sunsetImageList": [
    ],
    "nightImageList": [
    ]
};

// HTML elements
const imageGallery = document.getElementById('imageGallery');
const processBtn = document.getElementById('btnProcess');

// Functions
function handleChangeSelect(e) {
    const { name, value } = e.target;
    fileList[name].value = value;
    if(checkSelectValues() === true) processBtn.disabled = false;
}

async function readImages(dirPath) {
    fs.readdir(dirPath, function(err, items) {
        for (let i=0; i<items.length; i++) {
            if(items[i].includes(".jpg")){
                let numImage = items[i].match(regex)[0];
                fileList[numImage] = {
                    name: items[i]
                }

            }
        }
        console.log(fileList);
        fillGallery();
    });
}

async function fillGallery(){
    for(let key in fileList){
        console.log(key + ' - ' + fileList[key]);
        let column = document.createElement('div'); column.classList.add("column");
        let card = document.createElement('div'); card.classList.add("card");
        let cardImage = document.createElement('div'); cardImage.classList.add("card-image");
        let figureImage = document.createElement('figure'); figureImage.classList.add("image", "is-3by2");
        let imgNew = document.createElement('img'); imgNew.src = path.join(app.getPath('userData'), "output", remote.getGlobal('sharedObject').themeName, fileList[key].name);
        let cardContent = document.createElement('div'); cardContent.classList.add("card-content", "is-overlay", "is-clipped");
        let spanTag = document.createElement('div'); spanTag.classList.add("tag", "is-info"); spanTag.innerText = key;

        let selectValues = '<select name="'+key+'";><option value="">--Please choose an option--</option>\n' +
            '    <option value="sunrise">Sunrise</option>\n' +
            '    <option value="day">Day</option>\n' +
            '    <option value="sunset">Sunset</option>\n' +
            '    <option value="night">Night</option>\n' +
            '    </select>';

        let selectType = document.createElement('div'); selectType.classList.add("select","mt-1");
        selectType.onchange = handleChangeSelect;
        selectType.innerHTML = selectValues;

        figureImage.appendChild(imgNew);
        cardImage.appendChild(figureImage);
        cardContent.appendChild(spanTag);
        cardImage.appendChild(cardContent);
        card.appendChild(cardImage);
        column.appendChild(card);
        column.appendChild(selectType);
        imageGallery.appendChild(column);
    }
}

function checkSelectValues() {
    for(let key in fileList) {
        if(fileList[key].value === undefined) return false;
    }
    return true;
}

function generateJson() {
    defaultConfig.imageFilename = remote.getGlobal('sharedObject').themeName+"_*.jpg";
    for(let key in fileList) {
        switch (fileList[key].value) {
            case 'day':
                defaultConfig.dayImageList.push(key);
                break;
            case 'sunrise':
                defaultConfig.sunriseImageList.push(key);
                break;
            case 'sunset':
                defaultConfig.sunsetImageList.push(key);
                break;
            case 'night':
                defaultConfig.nightImageList.push(key);
                break;
            default:
                console.log(`Sorry, we are out of ${fileList[key].value}.`);
        }
    }

    console.log(defaultConfig);
    let data = JSON.stringify(defaultConfig);
    fs.writeFileSync(path.join(app.getPath('userData'), "output", remote.getGlobal('sharedObject').themeName, remote.getGlobal('sharedObject').themeName+".json"), data);

}

processBtn.onclick = () => {
    if(checkSelectValues() === true) generateJson();

}

readImages(path.join(app.getPath('userData'), "output", remote.getGlobal('sharedObject').themeName));

