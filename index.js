var port = process.env.PORT || 8080
const config = require('./config/config');
const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const shell = require('shelljs');


app.enable("trust proxy");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use("/apps", require('./routes/apps'));

// LB 체크용 
app.get('/healthcheck', function (req, res) {
    console.log('healthcheck');
    res.status(200).json('appflow api server node-env:' + process.env.NODE_ENV);
});

app.get('/reload_source', function (req, res) {
    shell.exec('sh check_reload.sh')
    res.status(200).json(true);
});


app.post('/reload_source', function (req, res) {
    shell.exec('sh check_reload.sh')
    res.status(200).json(true);
});

// app.use('/static', express.static(config.app.storage_path, {}));
app.use('/', express.static('admin/www', {}));
app.listen(port);

console.log("config:", config);
console.log("http://localhost:" + port);
console.log("NODE_ENV:" + process.env.NODE_ENV);


