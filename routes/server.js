const express = require('express');
const blogRouter = require('./blogRoutes.js');
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Blog API is up and running your majesty...')
})

server.use('/api/posts', blogRouter);

module.exports = server;