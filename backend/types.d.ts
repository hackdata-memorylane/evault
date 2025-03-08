interface Environment {
    ENCDENC_SALT: string
    PATTERN: string
    DB: string
}

interface EditableBlockInterface {
    data: {
        autodata: {
            uid: string
            timestamp: number
        }
        constructordata: {
            prevHash: string
            parentUid: string
            file: FileInterface
            pk: string
            nextPk: string
            version: string
        }
        nonce: number
    }

    signature: string
}

interface BlockInterface extends EditableBlockInterface {
    hash: string
    verify(pattern: string): boolean
}

type SearchableParameters = 
    "uid" | "timestamp" | "prevHash" | "file" | "pk" | "nextPk" | 
    "nonce" | "signature" | "hash" | "parentUid" | "version"

interface FileInterface {
    name: string
    size: number // kilobytes
    hash: string
    description: string
    userSignedHash: string
}

interface Keypair {
    publicKey: string
    privateKey: string
}

type AddToUnmiedQueueError = "parentBlockNotFound" | "unauthorizedParentBlock" | "success"

interface User {
    uid: string
    username: string
    password: string
    keypair: Keypair
    session: {
        id: string
        expires: number
    }
}
