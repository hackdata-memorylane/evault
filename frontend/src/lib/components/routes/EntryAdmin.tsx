import { useAtom } from "jotai";
import MyButton from "../utils/MyButton";
import MyInput from "../utils/MyInput";
import { atomUserAdmin } from "../../atoms";
import { useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { EntryResponse, EntryResponseAdmin } from "../../../../types";
import { useNavigate } from "react-router-dom";

export default function EntryAdmin() {
    
    const [hospitalId, setHospitalId] = useState("");
    const [password, setPassword] = useState("");
    const [_userAdmin, setUserAdmin] = useAtom(atomUserAdmin);
    const [_localStorage, setLocalStorage] = useLocalStorage("adminLogin", "");
    const navigate = useNavigate();

    async function entryClicked() {
        const data = await (await fetch(`http://localhost:3000/loginAdmin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                hospitalId,
                password,
            })
        })).json() as EntryResponseAdmin;
        
        console.log("hereere");

        if (data.err) {
            alert(data.err);
            return;
        }

        setUserAdmin(data.success);
        setLocalStorage(JSON.stringify({ 
            hospitalId: data.success.uid,
            password: data.success.password
        }));
        navigate("/forAdminHome");
    }

    return <div className="h-screen flex justify-center items-center bg-gradient-to-r from-40% from-[#AFEAFD] to-white">
        <div className={`
            w-[40rem] aspect-video shadow-gray-200 shadow-md rounded-md 
            flex flex-col justify-center items-center gap-5
            bg-white bg-opacity-30
        `}>
            <div className="text-2xl font-bold text-gray-500">
                Admin Login - <span className="text-gray-600">Vaultee</span>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <MyInput placeholder="Hospital Id" value={hospitalId} setValue={setHospitalId}/>
                    <MyInput placeholder="Password" value={password} setValue={setPassword}/>
                </div>
                <div className="flex flex-col gap-1">
                    <MyButton 
                        text="Login" 
                        className="w-full py-2"
                        onClick={entryClicked}
                    />
                </div>
            </div>
        </div>
    </div>
}
