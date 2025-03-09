export function getLocal(key: string) {
    return localStorage.getItem("@vaultee/" + key);
}

export function storeLocal(key: string, value: string) {
    localStorage.setItem("@vaultee/" + key, value);
}
