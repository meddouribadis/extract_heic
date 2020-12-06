const { shell, remote } = require('electron');
const app = remote.app;
const fs = require('fs');
const path = require('path');
const regex = /(?<=\_)(.*?)(?=\.jpg)/gm;
const fileList = {}

// HTML elements
const imageGallery = document.getElementById('imageGallery');

async function readImages(dirPath) {
    fs.readdir(dirPath, function(err, items) {
        for (let i=0; i<items.length; i++) {
            if(items[i].includes(".jpg")){
                let numImage = items[i].match(regex)[0];
                fileList[numImage] = items[i];
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
        let imgNew = document.createElement('img'); imgNew.src = path.join(app.getPath('userData'), "output", remote.getGlobal('sharedObject').themeName, fileList[key]);
        let cardContent = document.createElement('div'); cardContent.classList.add("card-content", "is-overlay", "is-clipped");
        let spanTag = document.createElement('div'); spanTag.classList.add("tag", "is-info"); spanTag.innerText = key;

        figureImage.appendChild(imgNew);
        cardImage.appendChild(figureImage);
        cardContent.appendChild(spanTag);
        cardImage.appendChild(cardContent);
        card.appendChild(cardImage);
        column.appendChild(card);
        imageGallery.appendChild(column);
    }
}

readImages(path.join(app.getPath('userData'), "output", remote.getGlobal('sharedObject').themeName));

