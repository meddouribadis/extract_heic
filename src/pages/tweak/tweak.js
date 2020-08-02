const { shell, remote } = require('electron');

console.log(remote.getGlobal('sharedObject').themeName);
