'use client';

import { useEffect, useRef, useState } from 'react';
import styles from "../styles/EmbeddedPage.module.css"
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
import useAppStore from '@/store/useAppStore';
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

export default function EmbeddedPage({ url, allowedOrigins = [],  savedProjects = [], onProjectsChange }) {
    const iframeRef = useRef(null);
    const serialHelperRef = useRef(null);
    const logged = useAppStore((state) => state.logged);
    const [isConnected, setIsConnected] = useState(false);
    const [currentBlocksData, setCurrentBlocksData] = useState(null);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

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
        if (!url) {
            console.error('Cannot send message: url is not set');
            return;
        }
        const targetOrigin = new URL(url).origin;
        console.log('Sending message to iframe:', {
            data,
            targetOrigin,
            iframeExists: !!iframeRef.current,
            contentWindow: !!iframeRef.current?.contentWindow
        });
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
                    
                    // Handle when user cancels (clicks outside or presses ESC)
                    const handleCancel = () => {
                        setTimeout(() => {
                            if (!input.files || input.files.length === 0) {
                                resolve({ success: false, error: 'No file selected' });
                            }
                        }, 1000);
                    };
                    
                    input.oncancel = () => resolve({ success: false, error: 'File selection cancelled' });
                    window.addEventListener('focus', handleCancel, { once: true });
                    
                    input.onchange = async (e) => {
                        window.removeEventListener('focus', handleCancel);
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



    // Load blocks from JSON file
    const loadBlocksFromJSON = async () => {
        try {
            if (window.showOpenFilePicker) {
                const [handle] = await window.showOpenFilePicker({
                    multiple: false,
                    types: [{ description: 'Blockly Workspace', accept: { 'application/json': ['.json'] } }]
                });
                const file = await handle.getFile();
                const text = await file.text();
                const blocksData = JSON.parse(text);
                return { success: true, blocksData };
            } else {
                return await new Promise((resolve) => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json,application/json';
                    input.onchange = async (e) => {
                        const f = e.target.files[0];
                        if (!f) return resolve({ success: false, error: 'No file selected' });
                        try {
                            const txt = await f.text();
                            const blocksData = JSON.parse(txt);
                            resolve({ success: true, blocksData });
                        } catch (parseError) {
                            resolve({ success: false, error: 'Invalid JSON file: ' + parseError.message });
                        }
                    };
                    input.click();
                });
            }
        } catch (error) {
            console.error('Error loading blocks JSON:', error);
            return { success: false, error: error.message };
        }
    };

    // Save blocks to database via API
    const saveBlocksToDatabase = async (blocksData, filename) => {
        try {
            // Prompt for user info if not provided
            
  
            console.log(API_URL)
            const response = await fetch(`${API_URL}/blocks/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_name: logged["user_name"],
                    user_email: logged["user_email"],
                    filename: filename || 'workspace.json',
                    blocks_json: JSON.stringify(blocksData)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to save to database');
            }

            const data = await response.json();
            console.log('Blocks saved to database:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Error saving blocks to database:', error);
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

    // Receive messages from iframe
    useEffect(() => {
        console.log('Setting up message listener...');
                console.log(savedProjects)
        
        const handleMessage = async (event) => {
            console.log('Message received from:', event.origin, 'Data:', event.data);
            
            const isAllowedOrigin = allowedOrigins.length === 0 ||
                allowedOrigins.includes(event.origin);

            if (!isAllowedOrigin) {
                console.warn('Message from unauthorized origin:', event.origin);
                return;
            }

            console.log('Received from iframe:', event.data.type);

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
                console.log("load code request received from iframe");
                const result = await loadCodeFromFile();
                console.log("File picker result:", result);
                
                const messageToSend = {
                    type: 'BLOCKLY_LOAD_RESULT',
                    success: result.success,
                    error: result.error,
                    code: result.code
                };
                
                console.log("Sending BLOCKLY_LOAD_RESULT to iframe:", messageToSend);
                sendMessageToIframe(messageToSend);
                console.log("Message sent");
            }
            
            // Handle BLOCKLY_READY notification
            if (event.data.type === 'BLOCKLY_READY') {
                console.log('Blockly iframe is ready');
            }

            // Handle SAVE_BLOCKS_DB request from iframe -> save to database
            if (event.data.type === 'BLOCKLY_SAVE_BLOCKS_DB') {
                const blocksData = event.data.blocksData;
                const filename = prompt('Enter a filename for this workspace:', 'my_workspace.json');
                
                if (!filename) {
                    alert('Save cancelled - no filename provided');
                    return;
                }
                console.log(blocksData)
                
                console.log('Received save blocks to DB request from iframe');
                const result = await saveBlocksToDatabase(blocksData, filename);
                
                if (result.success) {
                    alert('Blocks saved to database successfully!');
                    // Refresh the projects list
                    if (onProjectsChange) {
                        onProjectsChange();
                    }
                } else {
                    alert('Error saving blocks to database: ' + result.error);
                }
                
                sendMessageToIframe({
                    type: 'BLOCKLY_SAVE_BLOCKS_DB_RESULT',
                    success: result.success,
                    error: result.error
                });
            }

            // Handle LOAD_BLOCKS_JSON request from iframe -> show modal to select from saved projects
            if (event.data.type === 'BLOCKLY_LOAD_BLOCKS_JSON') {
                console.log("load code request received from iframe");

                setShowProjectModal(true);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [allowedOrigins, url, logged, onProjectsChange, savedProjects]);

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
        </div>;    }

    const handleProjectSelect = (project) => {
        try {
            const blocksData = JSON.parse(project.blocks_json);
            sendMessageToIframe({
                type: 'BLOCKLY_LOAD_BLOCKS_RESULT',
                success: true,
                blocksData: blocksData
            });
            setShowProjectModal(false);
            setSelectedProject(null);
        } catch (error) {
            console.error('Error parsing blocks:', error);
            sendMessageToIframe({
                type: 'BLOCKLY_LOAD_BLOCKS_RESULT',
                success: false,
                error: 'Failed to load project: ' + error.message
            });
        }
    };

    const handleModalClose = () => {
        setShowProjectModal(false);
        setSelectedProject(null);
        sendMessageToIframe({
            type: 'BLOCKLY_LOAD_BLOCKS_RESULT',
            success: false,
            error: 'Load cancelled by user'
        });    }

    return (
        <div className={styles.pageContainer}>
            {/* Project Selection Modal */}
            {showProjectModal && (
                <div className={styles.modalOverlay} onClick={handleModalClose}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Seleccionar Proyecto</h2>
                            <button className={styles.closeButton} onClick={handleModalClose}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            {savedProjects.length === 0 ? (
                                <p className={styles.noProjects}>No hay proyectos guardados</p>
                            ) : (
                                <div className={styles.projectList}>
                                    {savedProjects.map((project) => (
                                        <div 
                                            key={project.id} 
                                            className={`${styles.projectItem} ${selectedProject?.id === project.id ? styles.selected : ''}`}
                                            onClick={() => setSelectedProject(project)}
                                        >
                                            <div className={styles.projectInfo}>
                                                <div className={styles.projectName}>{project.filename}</div>
                                                <div className={styles.projectDate}>
                                                    {new Date(project.updated_time).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.cancelButton} onClick={handleModalClose}>Cancelar</button>
                            <button 
                                className={styles.loadButton} 
                                onClick={() => selectedProject && handleProjectSelect(selectedProject)}
                                disabled={!selectedProject}
                            >
                                Cargar Proyecto
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Iframe */}
            <iframe
                    ref={iframeRef}
                    src={url}
                    className={styles.page}
                    title="Embedded Interactive Page"
                    allow="serial; usb; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups allow-downloads"
                />
        </div>);
}