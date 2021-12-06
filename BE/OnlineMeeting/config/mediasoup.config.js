const os = require('os')
const ifaces = os.networkInterfaces()

const getLocalIp = () => {
    let localIp = '127.0.0.1'
    Object.keys(ifaces).forEach((ifname) => {
        for (const iface of ifaces[ifname]) {
            // Ignore IPv6 and 127.0.0.1
            if (iface.family !== 'IPv4' || iface.internal !== false) {
                continue
            }
            // Set the local ip to the first IPv4 address found and exit the loop
            localIp = iface.address
            return
        }
    })
    return localIp
}

module.exports = {
    listenIp: '0.0.0.0',
    listenPort: 8080,
    sslCrt: './ssl/cert.pem',
    sslKey: './ssl/key.pem',

    prometheus: {
        deidentify: false, // deidentify IP addresses
        listen: 'localhost',
        numeric: false, // show numeric IP addresses
        port: 8889, // allocated port
        quiet: false // include fewer labels
    },

    mediasoup: {
        // Worker settings
        numWorkers: Object.keys(os.cpus()).length,
        worker: {
            rtcMinPort: 40000,
            rtcMaxPort: 49999,
            logLevel: 'warn',
            logTags: [
                'info',
                'ice',
                'dtls',
                'rtp',
                'srtp',
                'rtcp'
                // 'rtx',
                // 'bwe',
                // 'score',
                // 'simulcast',
                // 'svc'
            ]
        },
        // Router settings
        router: {
            mediaCodecs: [
                {
                    kind: 'audio',
                    mimeType: 'audio/opus',
                    clockRate: 48000,
                    channels: 2
                },
                {
                    kind: 'video',
                    mimeType: 'video/VP8',
                    clockRate: 90000,
                    parameters: {
                        'x-google-start-bitrate': 1000
                    }
                }
            ]
        },
        // WebRtcTransport settings
        webRtcTransport: {
            listenIps: [
                {
                    ip: '0.0.0.0',
                    announcedIp: process.env.NODE_ENV === "development" ? getLocalIp() : process.env.SERVER_PUBLIC_IP // replace by public IP address
                }
            ],
            maxIncomingBitrate: 1500000,
            initialAvailableOutgoingBitrate: 1000000
        }
    }
}
