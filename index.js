const server = require('./routes.server.js');
const port = 5000;

server.listen(port, () => {
    console.log(`\n The Server is running on http://localhost:${port} \n`)
})