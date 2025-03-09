export interface EntryResponse {
    err?: string
    success: {
        username: string
        uid: string
        keypair: {
            publicKey: string
            privateKey: string
        }
        session: {
            id: string
            expires: number
        }
    }
}

export interface EntryResponseAdmin {
    err?: string
    success: {
        uid: string
        name: string
        password: string
        openRecords: {
            userId: string
            recordIds: string[]
        }[]
    }
}
