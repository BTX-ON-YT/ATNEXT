import express from 'express';
import { createServer } from 'http';
import os from 'os';
import path from 'path';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { Logger } from './src/util/Logger';
import { API } from './src/API';
import { WS } from './src/WebSocket';

const app = express();
const server = createServer(app);
let ThreadCount = 1;
let serviceAccount: any;
let ws: any;

app.use(express.json());

Logger.logClean(`
 ████████   ██████████    ███     ██  ██████████  ██      ██  ██████████
██      ██      ██        ████    ██  ██           ██    ██       ██
██      ██      ██        ██ ██   ██  ██            ██  ██        ██
██████████      ██        ██  ██  ██  █████████      ████         ██
██      ██      ██        ██   ██ ██  ██            ██  ██        ██
██      ██      ██        ██    ████  ██           ██    ██       ██
██      ██      ██        ██     ███  ██████████  ██      ██      ██
`);

Logger.logClean(`Cores: \x1b[36m${os.cpus().length}\x1b[0m (Using ${ThreadCount} Thread(s))\n`);

Logger.log('Path', `Running in ${path.resolve(__dirname)}`);

Logger.log('CPU', os.cpus()[0].model);

Logger.log('System', `${os.type()} ${os.release()}`);

Logger.log('Firebase', 'Loaging service account...');

serviceAccount = require('./keys/serviceAccountKey.json');

Logger.log('Firebase', 'Initializing firebase...');

initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://atmobile-383508-default-rtdb.asia-southeast1.firebasedatabase.app/'
});

Logger.log('Firebase', 'Initializing firestore...');

const db = getFirestore();

app.use('/api', new API(server, app, db).app);

ws = new WS(server, app, db);

server.listen(3000, () => {
    Logger.log('Server', 'Listening on port 3000');
});