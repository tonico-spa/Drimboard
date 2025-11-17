'use client';

import { useEffect, useRef, useState } from 'react';
import styles from "../styles/EmbeddedPage.module.css"
export default function EmbeddedPage({ url, allowedOrigins = [] }) {
    const iframeRef = useRef(null);
    const [serialPort, setSerialPort] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // Request serial port connection
    const connectSerialDevice = async () => {
        try {
            if (!navigator.serial) {
                alert('Web Serial API not supported in this browser');
                return;
            }

            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 }); // Adjust baudRate as needed

            setSerialPort(port);
            setIsConnected(true);

            // Send message to iframe that device is connected
            sendMessageToIframe({
                type: 'SERIAL_CONNECTED',
                portInfo: await port.getInfo()
            });

            console.log('Serial device connected:', port);
        } catch (error) {
            console.error('Error connecting to serial device:', error);
            alert('Failed to connect to device: ' + error.message);
        }
    };

    // Disconnect serial device
    const disconnectSerialDevice = async () => {
        if (serialPort) {
            await serialPort.close();
            setSerialPort(null);
            setIsConnected(false);
            sendMessageToIframe({ type: 'SERIAL_DISCONNECTED' });
        }
    };

    // Send message to iframe
    const sendMessageToIframe = (data) => {
        if (!url) return;
        const targetOrigin = new URL(url).origin;
        iframeRef.current?.contentWindow?.postMessage(data, targetOrigin);
    };

    // Receive messages from iframe
    useEffect(() => {
        const handleMessage = (event) => {
            const isAllowedOrigin = allowedOrigins.length === 0 ||
                allowedOrigins.includes(event.origin);

            if (!isAllowedOrigin) {
                console.warn('Message from unauthorized origin:', event.origin);
                return;
            }

            console.log('Received from iframe:', event.data);

            // If iframe requests serial connection
            if (event.data.type === 'REQUEST_SERIAL_CONNECTION') {
                connectSerialDevice();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [allowedOrigins]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (serialPort) {
                serialPort.close();
            }
        };
    }, [serialPort]);

    if (!url) {
        return <div className="w-full h-screen flex items-center justify-center">
            <p>No URL provided</p>
        </div>;
    }

    return (
        <div className={styles.pageContainer}>
            {/* Control bar */}
            {/* <div className="bg-gray-100 p-3 flex gap-3 items-center border-b">
                <button
                    onClick={connectSerialDevice}
                    disabled={isConnected}
                    className={`px-4 py-2 rounded ${isConnected
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                >
                    {isConnected ? '✓ Connected' : 'Connect Device'}
                </button>

                {isConnected && (
                    <button
                        onClick={disconnectSerialDevice}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                        Disconnect
                    </button>
                )}

                <span className="text-sm text-gray-600">
                    {isConnected ? 'Device connected to USB port' : 'No device connected'}
                </span>
            </div> */}

            {/* Iframe */}
            <div className={styles.pageContainer}>
                <iframe
                    ref={iframeRef}
                    src={url}
                    className={styles.page}
                    title="Embedded Interactive Page"
                    allow="serial; usb; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups"
                />
            </div>
        </div>);
}