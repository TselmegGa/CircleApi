//store/modules/auth.js

const crypto = require('crypto');
const controller = require('../controller/user.controller');

//https://nodejs.org/api/crypto.html#cryptoprivatedecryptprivatekey-buffer
//crypto.privateEncrypt(privateKey, buffer)
//crypto.publicEncrypt(key, buffer)
//crypto.privateDecrypt(privateKey, buffer)
//crypto.publicDecrypt(key, buffer)

export const encodeWithPublic = (hash) => {
    if(store.state.key === null){
        return false;
    }
    return crypto.publicEncrypt(hash);
};

export const decodeWithPublic = (hash) => {
    if(store.state.key === null){
        return false;
    }
    return crypto.publicDecrypt(hash);
};
