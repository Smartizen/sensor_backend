var express = require('express');
var helmet = require('helmet');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
var port = process.env.PORT || 5000;

var manageDevice = require('./routes/manageDevice');
var orgAdminstraion = require('./routes/orgAdminstration');
var devideData = require('./routes/devideData');
var proxy = require('./routes/proxy');

const { connectIoTF } = require('./config/iot');

var configDB = require('./config/database.js');

var socketio = require('socket.io');
var WebSockets = require('./utils/WebSockets.js');

// configuration ===============================================================
const connectDB = async () => {
  await mongoose.connect(
    configDB.url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    (error) => {
      if (error) console.log('error :', error);
      else console.log('Connect successfully');
    }
  );
  mongoose.set('useCreateIndex', true);
};

connectDB().catch((error) => console.error(error));

// config log + security =========================================================
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet());

app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);

connectIoTF();

// routes ======================================================================

app.use('/device', manageDevice);
app.use('/admin', orgAdminstraion);
app.use('/data', devideData);
app.use('/proxy', proxy);

// launch ======================================================================
var server = app.listen(port);

// Socket ======================================================================
global.io = socketio.listen(server);
global.io.on('connection', WebSockets.connection);
