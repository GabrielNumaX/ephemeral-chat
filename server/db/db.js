require('dotenv').config();
const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI;

mongoose.connect(URI);

const connection = mongoose.connection;

try {

    connection.once('open', () => {
        console.log('DB is running');
    })

} catch(error) {
    console.log('Error while connecting DB');

    console.log(error.message);
}