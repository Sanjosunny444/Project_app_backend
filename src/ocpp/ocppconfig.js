const { RPCServer } = require('ocpp-rpc');
const WebSocket = require('ws');

function startOcppServer(httpServer) {
    //log the ip address of the server
    const os = require('os');
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                console.log(`🌐 OCPP Server IP Address: http://${iface.address}`);
            }
        }
    }

    // Create WebSocket server on same HTTP server
    const wss = new WebSocket.Server({
        server: httpServer,
        path: '/ocpp'
    });

    // Create OCPP RPC server
    const ocppServer = new RPCServer({
        protocols: ['ocpp1.6'],
        strictMode: false
    });

    // Bind WebSocket connections to OCPP
    wss.on('connection', (ws, request) => {
        ocppServer.accept(ws, request);
    });

    // Handle charge point connection
    ocppServer.on('client', async (client) => {
        console.log(`🔌 Charge Point connected: ${client.identity}`);

        client.handle('BootNotification', async ({ params }) => {
            console.log('📢 BootNotification:', params);
            return {
                status: 'Accepted',
                currentTime: new Date().toISOString(),
                interval: 300
            };
        });

        client.handle('Heartbeat', async () => {
            console.log(`💓 Heartbeat from ${client.identity}`);
            return {
                currentTime: new Date().toISOString()
            };
        });

        client.handle('Authorize', async ({ params }) => {
            console.log('🔑 Authorize:', params.idTag);
            return {
                idTagInfo: { status: 'Accepted' }
            };
        });

        client.handle('StartTransaction', async ({ params }) => {
            console.log('▶ StartTransaction:', params);
            return {
                transactionId: Date.now(),
                idTagInfo: { status: 'Accepted' }
            };
        });

        client.handle('StopTransaction', async ({ params }) => {
            console.log('⏹ StopTransaction:', params);
            return {
                idTagInfo: { status: 'Accepted' }
            };
        });

        client.on('disconnect', () => {
            console.log(`❌ Charge Point disconnected: ${client.identity}`);
        });
    });

    console.log('⚡ OCPP Server listening on /ocpp');
}

module.exports = { startOcppServer };
