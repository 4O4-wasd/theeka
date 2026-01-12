export const generateBase64Token = (length = 128) => {
    const randomBytes = crypto.getRandomValues(new Uint8Array(length));
    const token = btoa(String.fromCharCode(...randomBytes));
    return token;
};
