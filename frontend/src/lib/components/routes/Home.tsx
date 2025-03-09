import { useAtomValue, useSetAtom } from "jotai";
import { atomNewDocModalVisible, atomUser } from "../../atoms";
import MyButton from "../utils/MyButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import DocLeaf from "../standalone/DocLeaf";
import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({ apiKey: "" });

type PatientRecordsResponse = {
    id: string;
    doctorName: string;
    hospitalName: string;
    hospitalId: string;
    timestamp: number;
    details: string;
}[];

export default function Home() {
    const setNewDocModalVisible = useSetAtom(atomNewDocModalVisible);
    const [_localStorage, setLocalStorage] = useLocalStorage("sessionid", "");
    const [userDocs, setUserDocs] = useState<PatientRecordsResponse>([]);
    const user = useAtomValue(atomUser);
    
    useEffect(() => {
        async function fetchDocs() {
            const response = await fetch("http://localhost:3000/getAllPatientRecords", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user?.uid,
                }),
            });
            const data = await response.json();
            console.log(data, user);
            setUserDocs(data);
        }

        fetchDocs();
    }, [user]);

    function logout() {
        setLocalStorage("");
        window.location.href = "/";
    }

    function mine() {
        fetch("http://localhost:3000/mineBlock", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: user?.uid,
            }),
        }).then(async (response) => {
            console.log(await response.json());
        });
    }

    function grantAccess() {
        const hospitalId = prompt("Enter hospital ID");

        if (!hospitalId) {
            return;
        }

        fetch("http://localhost:3000/grantAccess", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                hospitalId,
                medicalRecordIds: userDocs.map((doc) => doc.id),
                userId: user?.uid,
                grantAccess: true,
            }),
        }).then(async (response) => {
            console.log(await response.json());
        });
    }

    function revokeAccess() {
        const hospitalId = prompt("Enter hospital ID");

        if (!hospitalId) {
            return;
        }

        fetch("http://localhost:3000/grantAccess", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                hospitalId,
                medicalRecordIds: userDocs.map((doc) => doc.id),
                userId: user?.uid,
                grantAccess: false,
            }),
        }).then(async (response) => {
            console.log(await response.json());
        });
    }

    async function summarize() {
        const medicalHistory = userDocs.map((doc) => doc.details).join("\n");
        const query = "Summarize the following medical history: " + medicalHistory;

        const response = await client.chat.complete({
            model: "mistral-large-latest",
            messages: [{role: 'user', content: query}],
        });
        console.log("ghi");

        alert(response.choices?.[0].message.content);
    }

    return <div className="bg-gradient-to-r from-[#AFEAFD] to-white h-screen pt-20">
        <div className="flex justify-between p-5 px-10">
            <div className="flex gap-4">
                <MyButton text="Summarize" className="py-1 bg-gradient-to-r from-cyan-500 to-cyan-300" onClick={summarize} />
            </div>

            <div className="flex gap-4 items-center">
                <MyButton text="Mine" className="py-1 bg-black" onClick={mine}/>
                <MyButton text="Grant Access" className="py-1" onClick={grantAccess} />
                <MyButton text="Revoke Access" className="py-1 bg-red-600" onClick={revokeAccess} />
                <FontAwesomeIcon icon={faSignOut} className="text-lg cursor-pointer" onClick={logout}/>
            </div>
        </div>
        <div className="p-5 px-10">
            <div className="font-semibold text-xl">Your Medical Records</div>
            <div className="mt-5">
                {
                    userDocs.map((doc) => {
                        return <DocLeaf {...doc} key={doc.id}/>
                    })
                }
            </div>
        </div>
        
    </div>
}
