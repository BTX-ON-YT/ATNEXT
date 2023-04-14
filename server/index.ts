import express from 'express';
import { createServer } from 'http';
import os from 'os';
import path from 'path';
import { Logger } from './src/util/Logger';

const app = express();
const server = createServer(app);
let ThreadCount = 1;

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

server.listen(3000, () => {
    Logger.log('Server', 'Listening on port 3000');
});