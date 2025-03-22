const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const posts = require('./routes/post');
const users = require('./routes/user');
const tokens = require('./routes/token');
const path = require('path');
const { sendInitializationAndUrls } = require('./tcpClient');

require('custom-env').env(process.env.NODE_ENV, './config');
mongoose.connect(process.env.CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB');
        const urls = process.env.URL_LIST.split(';');
        sendInitializationAndUrls(urls, (err, isDenied) => {
            if (err) {
                console.error('Failed to send data via TCP:', err);
            } else if (isDenied) {
                console.log('Server has denied one or more URLs.');
            } else {
                console.log('Initialization and URL data sent successfully.');
            }
        });
    })
    .catch((error) => console.error('Error connecting to MongoDB:', error));
var app = express();
app.use(express.static('public'));
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use('/api/posts', posts);
app.use('/api/users', users);
app.use('/api/tokens', tokens);
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(process.env.PORT);

