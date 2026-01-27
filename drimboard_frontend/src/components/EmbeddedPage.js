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

    // Save code to a local file (uses File System Access API when available,
    // falls back to creating a download)
    const saveCodeToFile = async (code, suggestedName = 'code.py') => {
        try {
            if (window.showSaveFilePicker) {
                const handle = await window.showSaveFilePicker({
                    suggestedName,
                    types: [{ description: 'Code', accept: { 'text/plain': ['.py', '.txt'] } }]
                });
                const writable = await handle.createWritable();
                await writable.write(code);
                await writable.close();
            } else {
                const blob = new Blob([code], { type: 'text/plain' });
                const urlObj = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = urlObj;
                a.download = suggestedName;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(urlObj);
            }

            return { success: true };
        } catch (error) {
            console.error('Error saving file:', error);
            return { success: false, error: error.message };
        }
    };

    // Load code from a local file (uses File System Access API when available,
    // falls back to an input[type=file] picker)
    const loadCodeFromFile = async () => {
        try {
            if (window.showOpenFilePicker) {
                const [handle] = await window.showOpenFilePicker({
                    multiple: false,
                    types: [{ description: 'Code', accept: { 'text/plain': ['.py', '.txt'] } }]
                });
                const file = await handle.getFile();
                const text = await file.text();
                return { success: true, code: text };
            } else {
                return await new Promise((resolve) => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.py,.txt,text/plain';
                    input.onchange = async (e) => {
                        const f = e.target.files[0];
                        if (!f) return resolve({ success: false, error: 'No file selected' });
                        const txt = await f.text();
                        resolve({ success: true, code: txt });
                    };
                    input.click();
                });
            }
        } catch (error) {
            console.error('Error loading file:', error);
            return { success: false, error: error.message };
        }
    };

    // Request current code from the iframe (expects iframe to respond with
    // a postMessage of type 'BLOCKLY_CURRENT_CODE' containing { code })
    const requestCodeFromIframe = (timeoutMs = 10000) => {
        return new Promise((resolve) => {
            console.log('Requesting code from iframe...');
            const targetOrigin = url ? new URL(url).origin : '*';
            let settled = false;

            const timer = setTimeout(() => {
                if (settled) return;
                settled = true;
                window.removeEventListener('message', listener);
                console.error('Timeout: iframe did not respond with code');
                resolve({ success: false, error: 'Timeout: iframe did not respond. Make sure the iframe handles BLOCKLY_REQUEST_CODE messages.' });
            }, timeoutMs);

            const listener = (event) => {
                const isAllowedOrigin = allowedOrigins.length === 0 ||
                    allowedOrigins.includes(event.origin);
                if (!isAllowedOrigin) return;

                if (event.data && event.data.type === 'BLOCKLY_CURRENT_CODE') {
                    if (settled) return;
                    settled = true;
                    clearTimeout(timer);
                    window.removeEventListener('message', listener);
                    console.log('Received code from iframe:', event.data.code?.substring(0, 50) + '...');
                    resolve({ success: true, code: event.data.code });
                }
            };

            window.addEventListener('message', listener);

            // Ask iframe to send its current code
            iframeRef.current?.contentWindow?.postMessage({ type: 'BLOCKLY_REQUEST_CODE' }, targetOrigin);
        });
    };

    // Handlers for the Save and Load buttons
    const handleSaveClick = async () => {
        console.log('Save button clicked - asking iframe to send code for saving');
        // Send a message to iframe to trigger it to send its code for saving
        sendMessageToIframe({ type: 'BLOCKLY_TRIGGER_SAVE' });
        // The iframe should respond with BLOCKLY_SAVE_CODE which is already handled in useEffect
    };

    const handleLoadClick = async () => {
        console.log('Load button clicked');
        const loadRes = await loadCodeFromFile();
        if (!loadRes.success) {
            console.error('Failed to load file:', loadRes.error);
            alert('Error loading file: ' + loadRes.error);
            sendMessageToIframe({ type: 'BLOCKLY_LOAD_RESULT', success: false, error: loadRes.error });
            return;
        }

        // Send loaded code to iframe to set it in the editor
        console.log('Sending loaded code to iframe...');
        sendMessageToIframe({ type: 'BLOCKLY_SET_CODE', code: loadRes.code });
        alert('Code loaded! Sent to editor.');
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
            
            // Handle SAVE_CODE request from iframe -> prompt user to save file
            if (event.data.type === 'BLOCKLY_SAVE_CODE') {
                const code = event.data.code || '';
                const name = event.data.suggestedName || 'code.py';
                console.log('Received save request from iframe with code length:', code.length);
                const result = await saveCodeToFile(code, name);
                if (result.success) {
                    alert('Code saved successfully!');
                } else {
                    alert('Error saving: ' + result.error);
                }
                sendMessageToIframe({
                    type: 'BLOCKLY_SAVE_RESULT',
                    success: result.success,
                    error: result.error
                });
            }

            // Handle LOAD_CODE request from iframe -> prompt user to pick a file and load
            if (event.data.type === 'BLOCKLY_LOAD_CODE') {
                const result = await loadCodeFromFile();
                sendMessageToIframe({
                    type: 'BLOCKLY_LOAD_RESULT',
                    success: result.success,
                    error: result.error,
                    code: result.code
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

            {/* Controls */}
       <div className={styles.controls} >
                <button onClick={handleSaveClick} className={styles.controlButton} style={{ marginRight: 8 }}>Guardar codigo</button>
                <button onClick={handleLoadClick} className={styles.controlButton}>Cargar codigo</button>
            </div>

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