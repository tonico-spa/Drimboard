'use client';

import { useEffect, useRef, useState } from 'react';
import styles from "../styles/EmbeddedPage.module.css"

// Serial Helper Class for ESP32 Communication
class SerialHelper {
    constructor() {
        this.port = null;
        this.writer = null;
        this.reader = null;
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
        this.readBuffer = '';
    }

    async connect() {
        try {
            this.port = await navigator.serial.requestPort();
            await this.port.open({
                baudRate: 115200,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                flowControl: 'none'
            });
            
            this.startReading();
            return true;
        } catch (error) {
            console.error('Error de conexión:', error);
            return false;
        }
    }

    async sendCode(code) {
        if (!this.port) return false;
        
        try {
            this.writer = this.port.writable.getWriter();
            
            // Limpiar buffer y cancelar cualquier operación pendiente
            await this._writeWithDelay('\x03', 500); // Ctrl+C
            await this._writeWithDelay('\x03', 100);
            await this._writeWithDelay('\x03', 100);
            
            // Esperar a que el ESP32 esté listo
            await this.delay(2000);
            
            // Entrar en modo paste
            await this._writeWithDelay('\x05', 100); // Ctrl+E
            
            // Preparar y enviar el código línea por línea
            const lines = this._prepareCode(code).split('\r\n');
            
            for (const line of lines) {
                if (line.trim()) {
                    await this._writeWithDelay(line + '\r\n', 100);
                }
            }
            
            // Salir del modo paste y ejecutar
            await this._writeWithDelay('\x04', 100); // Ctrl+D
            
            return true;
        } catch (error) {
            console.error('Error enviando código:', error);
            return false;
        } finally {
            if (this.writer) {
                this.writer.releaseLock();
                this.writer = null;
            }
        }
    }

    _prepareCode(code) {
        let safeCode = code
            .replace(/\r\n/g, '\n')
            .replace(/\n/g, '\r\n')
            .replace(/[^\x20-\x7E\r\n]/g, function(char) {
                const code = char.charCodeAt(0);
                return '\\x' + code.toString(16).padStart(2, '0');
            });
        
        return safeCode;
    }

    async _writeWithDelay(data, delayMs) {
        await this.writer.write(this.encoder.encode(data));
        await this.delay(delayMs);
    }

    async startReading() {
        try {
            this.reader = this.port.readable.getReader();
            while (true) {
                const { value, done } = await this.reader.read();
                if (done) break;
                const text = this.decoder.decode(value);
                this.readBuffer += text;
                console.log('ESP32:', text);
            }
        } catch (error) {
            if (error.name !== 'InterruptedError') {
                console.error('Error en lectura:', error);
            }
        } finally {
            if (this.reader) {
                this.reader.releaseLock();
                this.reader = null;
            }
        }
    }

    async disconnect() {
        if (this.reader) {
            try {
                await this.reader.cancel();
            } catch (e) { /* Ignorar */ }
        }
        if (this.port) {
            try {
                await this.port.close();
            } catch (e) { /* Ignorar */ }
        }
        this.port = null;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default function EmbeddedPage({ url, allowedOrigins = [] }) {
    const iframeRef = useRef(null);
    const serialHelperRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    // Initialize serial helper
    useEffect(() => {
        serialHelperRef.current = new SerialHelper();
    }, []);

    // Execute code on ESP32
    const executeCode = async (code) => {
        try {
            if (!navigator.serial) {
                throw new Error('Web Serial API no soportado en este navegador');
            }

            const helper = serialHelperRef.current;
            
            // Disconnect and reconnect to ensure clean state
            await helper.disconnect();
            const connected = await helper.connect();
            
            if (!connected) {
                throw new Error('No se pudo conectar con el dispositivo');
            }
            
            setIsConnected(true);
            
            // Send code to ESP32
            const success = await helper.sendCode(code);
            
            if (!success) {
                throw new Error('Error al enviar el código');
            }
            
            return { success: true };
        } catch (error) {
            console.error('Error executing code:', error);
            return { success: false, error: error.message };
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
        const handleMessage = async (event) => {
            const isAllowedOrigin = allowedOrigins.length === 0 ||
                allowedOrigins.includes(event.origin);

            if (!isAllowedOrigin) {
                console.warn('Message from unauthorized origin:', event.origin);
                return;
            }

            console.log('Received from iframe:', event.data);

            // Handle RUN_CODE request from iframe
            if (event.data.type === 'BLOCKLY_RUN_CODE') {
                const code = event.data.code;
                console.log('Executing code from iframe:', code);
                
                const result = await executeCode(code);
                
                // Send result back to iframe
                sendMessageToIframe({
                    type: 'BLOCKLY_CODE_RESULT',
                    success: result.success,
                    error: result.error
                });
            }
            
            // Handle BLOCKLY_READY notification
            if (event.data.type === 'BLOCKLY_READY') {
                console.log('Blockly iframe is ready');
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [allowedOrigins, url]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (serialHelperRef.current) {
                serialHelperRef.current.disconnect();
            }
        };
    }, []);

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