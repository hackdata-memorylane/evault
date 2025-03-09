import { faPlus } from "@fortawesome/free-solid-svg-icons";
import MyButton from "../utils/MyButton";
import { atomNewDocModalVisible, atomUserAdmin } from "../../atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

type PatientRecordsResponse = {
    id: string;
    doctorName: string;
    hospitalName: string;
    hospitalId: string;
    timestamp: number;
    details: string;
}[];

function log(...args: any) {
    console.log(...args);
    return 0;
}

export default function ForAdminHome() {
    const adminUser = useAtomValue(atomUserAdmin);
    const setNewDocModalVisible = useSetAtom(atomNewDocModalVisible);

    const [userToMedicalRecords, setUserToMedicalRecords] = useState<{ [key: string]: PatientRecordsResponse }>({});

    useEffect(() => {
        async function fetchDocs() {
            const response = await fetch("http://localhost:3000/getAllowedUserRecords", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    hospitalId: adminUser?.uid,
                }),
            });
            const data = await response.json();
            setUserToMedicalRecords(data);
        }

        fetchDocs();
    }, [adminUser]);

    return <div className={`
        h-screen bg-gradient-to-r from-[#AFEAFD] to-white pt-20
    `}>
        <div className="p-6 px-8 flex justify-between items-center">
            <div className="font-semibold text-xl">{adminUser?.name}</div>
            <MyButton 
                text="New Medical Record" 
                className="py-2 text-sm" 
                icon={faPlus} 
                onClick={() => setNewDocModalVisible(true)}
            />
        </div>

        <div className="p-6 px-8">
            {
                Object.keys(userToMedicalRecords).map((userId) => {
                    return <div key={userId} className="mb-6 flex flex-col gap-3 mx-32 p-5">
                        <div className="font-semibold text-lg">{userId}</div>
                        <div className="grid grid-cols-1 gap-4">
                            {
                                typeof userToMedicalRecords[userId] != "string" &&
                                userToMedicalRecords[userId].map((record) => {
                                    return <div key={record.id} className="bg-white opacity-50 p-4 rounded-md shadow-md">
                                        <div className="flex justify-between">
                                            <div>Dr. {record.doctorName}</div>
                                            <div>{record.hospitalName}</div>
                                            <div>{new Date(record.timestamp).toLocaleDateString()}</div>
                                        </div>
                                        <div className="text-sm mt-2">{record.details}</div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                })
            }
        </div>
    </div>
}
