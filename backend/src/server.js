const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');

const { setupWebsocket } = require('./websocket');

dotenv.config();
const app = express();
const server = http.Server(app);

setupWebsocket(server);

const PORT = 5000;
const API_VERSION = process.env.API_VERSION;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./database');

// require('./app/controllers/DevController')(app);
require('./app/controllers/index')(app);

app.get(API_VERSION, (req, res) => {
	res.send({ message: 'Welcome to OmniStack10 API by NodeJS and MongoDB' });
});

server.listen(PORT, () => console.log(`Server is up and running in port ${PORT}`));
