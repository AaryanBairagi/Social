import crypto from "crypto";

const ALGORITHM = "aes-256-gcm"

function getChatKey() : Buffer {
    const secret = process.env.CHAT_ENCRYPTION_KEY;

    if(!secret){
        throw new Error("Chat Encryption Key is not set");
    } 

    //Expecting 64 char hex string
    const key = Buffer.from(secret,"hex");
    if(key.length !== 32) throw new Error("Key must be 32 bytes long");
    return key;
}

export function Encryption(plaintext:string){
    const key = getChatKey();
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(ALGORITHM,key,iv);
    const encrypted = Buffer.concat([
        cipher.update(plaintext,"utf-8"),
        cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    return {
        encryptedText : encrypted.toString("base64"),
        iv : iv.toString("base64"),
        authTag : authTag.toString("base64"),
        keyVersion : "v1"
    }
}

export function Decryption({encryptedText,iv,authTag}:{encryptedText : string , iv : string , authTag : string}){
    const key = getChatKey();
    const decipher = crypto.createDecipheriv(ALGORITHM,key,Buffer.from(iv,"base64"));
    decipher.setAuthTag(Buffer.from(authTag,"base64"));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedText,"base64")),
        decipher.final()
    ]);
    
    return decrypted.toString("utf-8");
}

