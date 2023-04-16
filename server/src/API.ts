import express from 'express';
import { generateUserToken, generateUserID } from './util/Tokens';

export class API {
    public app: any;
    public server: any;
    public ExpressApp: any;
    public constructor(server: any, app: any, db: any) {
        this.server = server;
        this.ExpressApp = app;
        this.app = express.Router();

        this.app.use(express.json());

        this.app.get('/ping', (req: any, res: any) => {
            res.send({
                message: 'pong',
                timestamp: Date.now()
            });
        });

        this.app.post('/auth/createUser', (req: any, res: any) => {
            const { firstName, lastName, email, password } = req.body;

            if (!firstName || !lastName || !email || !password) {
                res.status(400).send({
                    message: 'Missing required fields'
                });

                return;
            }

            const user = {
                id: generateUserID(),
                firstName,
                lastName,
                email,
                password,
                token: generateUserToken(),
                username: `${firstName} ${lastName}`,
            }

            const userDoc = db.collection('users').doc(user.id.toString());

            userDoc.set(user).then(() => {
                res.send({
                    message: 'User created',
                    user
                });
            }).catch((err: any) => {
                res.status(500).send({
                    message: 'An error occurred',
                    error: err
                });
            });
        });
    }
}