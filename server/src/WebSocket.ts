import express from 'express';
import { WebSocketServer } from 'ws';
import { generateUserToken, generateUserID } from './util/Tokens';

export class WS {
    public server: any;
    public app: any;
    public wss: any;
    public clients: Map<any, any>;
    public constructor(server: any, app: any, db: any) {
        this.server = server;
        this.app = app;
        this.clients = new Map();

        this.wss = new WebSocketServer({ server: this.server });

        this.wss.on('connection', (ws: any) => {
            ws.on('message', (message: any) => {
                let data: any;

                try {
                    data = JSON.parse(message);
                } catch (err) {
                    console.log(err);
                    ws.close();
                    return;
                }

                switch (data.op) {
                    case 2: {
                        const { token, id } = data.d;

                        if (!token || !id) {
                            ws.close();
                            return;
                        }

                        const userDoc = db.collection('users').doc(id.toString());

                        if (!userDoc) {
                            ws.close();
                            return;
                        }

                        userDoc.get().then((doc: any) => {
                            if (!doc.exists) {
                                ws.close();
                                return;
                            }

                            const user = doc.data();

                            if (user.token !== token) {
                                ws.close();
                                return;
                            }

                            this.clients.set(ws, {
                                ws: ws,
                                sessionID: this.clients.size + 1,
                                user
                            });

                            ws.send(JSON.stringify({
                                op: 10,
                                d: {
                                    heartbeat_interval: 45000
                                }
                            }));
                        }).catch((err: any) => {
                            ws.close();
                            return;
                        });
                    }
                }
            });
        });
    }
}