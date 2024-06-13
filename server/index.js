require('express-async-errors');
const error = require('./middleware/asyncErrors');
require('dotenv').config();
const express = require('express');
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const socketManager = require('./socketManager/socketManager');

// const checkJwt = require('./middleware/tokenCheck');

require('./db/db');

const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const requestRoutes = require('./routes/requestRoutes');

const app = express();

const http = require('http');
const server = http.createServer(app);

// this is IMPORTANT line 66 export NOT WORKING
// const io = module.exports = new Server(server, {
//   cors: {
//     origin: process.env.NODE_ENV === "production" ? false : ['http://localhost:3000'],
//   },
//   credentials: true,
// });
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? false : ['http://localhost:3000'],
  },
  credentials: true,
});

// console.log('SERVER io');
// console.log({io});

io.on("connection", socketManager);
// io.on("connection", () => {
//   console.log('SOCKET CONNECTED')
// });


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

// module.exports = { io }
// module.exports = io; 


