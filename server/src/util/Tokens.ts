import crypto from 'crypto';

export function generateUserToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function generateUserID() {
    return Date.now() + (crypto.randomBytes(8).readUInt32BE(1));
}