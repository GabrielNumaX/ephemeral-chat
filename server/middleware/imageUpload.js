const multer = require('multer');
// const path = require('path')
// const sharp = require('sharp');
// const fs = require('fs');

// const storage = multer.diskStorage({

//     destination: function(req, file, cb) {

//         const folder = './uploads';
//         if (!fs.existsSync(folder)){
//             fs.mkdirSync(folder);
//         }

//         cb(null, folder);
//     },

//     filename: function(req, file, cb) {

//         console.log('file', file);

//         cb(null, `ephemeral-user-${Date.now()}${path.extname(file.originalname)}`);

//     }
// })

const storage = multer.memoryStorage();

const upload = multer({ storage: storage })

module.exports = upload;