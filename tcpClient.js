// tcpClient.js
const net = require('net');

const TCP_SERVER_HOST = '127.0.0.1';
const TCP_SERVER_PORT = 5555;

function sendInitializationAndUrls(urls, callback) {
    const client = new net.Socket();
    
    // Prepare the initialization data
    const initParts = process.env.INITIALIZED.split(';');
    const initData = initParts.join('\n'); 

    // Prepare the URLs data, formatting each URL
    const formattedUrls = urls.map(url => `1\n${url}`).join('\n');

    client.connect(TCP_SERVER_PORT, TCP_SERVER_HOST, () => {
        console.log('TCP Connection established. Sending INITIALIZED data.');
        client.write(initData);  // Send the INITIALIZED data
        client.write(formattedUrls); // Immediately send the URLs after initialization data
    });

    client.on('data', (data) => {
        const response = data.toString().trim();
        console.log('Received data from TCP server:', response);
        client.end(); // Close the connection after receiving response
    });

    client.on('end', () => {
        console.log('TCP connection closed');
        callback(null, false); 
    });

    client.on('error', (err) => {
        console.error('TCP Connection Error:', err);
        callback(err);
    });
}

module.exports = { sendInitializationAndUrls };
