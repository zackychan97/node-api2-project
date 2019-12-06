const express = require('express');
const blogRouter = require('./blog-routes.js');
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`<h1>Server running, sweeeeeeeeet.</h1>`)
})

server.use('/api/posts', blogRouter);

module.exports = server;