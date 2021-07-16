require('express-async-errors');
const error = require('./middleware/asyncErrors');
require('dotenv').config();
const express = require('express');

const checkJwt = require('./middleware/tokenCheck');

require('./db/db');

const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const requestRoutes = require('./routes/requestRoutes');

const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
// this is IMPORTANT line 66 export NOT WORKING
const io = module.exports = new Server(server, {
  cors: 'http://localhost:3000'
});

const cors = require('cors');
const path = require('path');

const socketManager = require('./socketManager/socketManager');

const PORT = parseInt(process.env.PORT, 10) || 3030;
const dev = process.env.NODE_ENV !== "production";


app.use(cors());
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


app.use('/api', userRoutes);
app.use('/api', contactRoutes);
app.use('/api', requestRoutes);

app.get('/uploads/:fileName',
  // this is TODO
  // checkJwt, 
  async (req, res) => {

    const options = {
      root: path.join(__dirname, '..')
    };

    res.sendFile(req.url, options, function (err) {
      if (err) {
        console.log('Error sending file:', err.message)
      } else {
        // console.log('Sent:', req.url);
      }
    });
  })

io.on('connection', socketManager);

// // this works on DEV ENV
// app.use(express.static(path.join(__dirname, '..', 'build')));

// app.get('*', (req, res) => {

//   console.log('get *')

//   res.sendFile(path.join(__dirname, '..', 'build', 'index.html')) //relative path
// })


// this is for PROD ENV
if (process.env.NODE_ENV === 'production') {

  //serves react app  
  app.use(express.static(path.join(__dirname, '..', 'build')));

  app.get('*', (req, res) => {

    res.sendFile(path.join(__dirname, '..', 'build', 'index.html')) //relative path
  })

}

app.use(error);

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});

// module.exports = io;