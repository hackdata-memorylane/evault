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
            medicalRecord: MedicalRecord
            pk: string
            nextPk: string
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
    "uid" | "timestamp" | "prevHash" | "med.patient.id" | "med.patient.name" | 
    "med.patient.age" | "med.doctor.name" | "med.hospital.name" | "med.hospital.id" | 
    "pk" | "nextPk" | "nonce" | "signature" | "hash" | "accessTo"

interface MedicalRecord {
    patient: {
        id: string,
        name: string,
        age: number,
    }
    doctor: {
        name: string,
    }
    hospital: {
        name: string,
        id: string,
    }
    record: {
        name: string,
        size: number,
        hash: string,
    }
    medicalDetails: string

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
