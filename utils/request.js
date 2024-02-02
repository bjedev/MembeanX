import {encryptJson} from "@/utils/encryption";
import {v4} from "uuid";

export function makeEncryptedJsonRequestBody(data) {
    const generatedEncryptionToken = v4();
    const encryptedRequest = encryptJson(data, generatedEncryptionToken);
    return {token: generatedEncryptionToken, cipher: encryptedRequest};
}