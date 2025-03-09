import { useAtom } from "jotai";
import MyButton from "../utils/MyButton";
import MyInput from "../utils/MyInput";
import { atomEntryMode, atomUser } from "../../atoms";
import { useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { EntryResponse } from "../../../../types";
import { useNavigate } from "react-router-dom";

export default function Entry() {
    const [mode, setMode] = useAtom(atomEntryMode);
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [_user, setUser] = useAtom(atomUser);
    const [_localStorage, setLocalStorage] = useLocalStorage("sessionid", "");
    const navigate = useNavigate();

    function onModeChange() {
        setMode(mode === "login" ? "register" : "login");
    }

    async function entryClicked() {
        const data = await (await fetch(`http://localhost:3000/${mode}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password,
                repeatPassword
            })
        })).json() as EntryResponse;
        
        if (data.err) {
            alert(data.err);
            return;
        }

        setUser(data.success);
        setLocalStorage(data.success.session.id);
        navigate("/home");
    }

    return <div className="h-screen flex justify-center items-center bg-gradient-to-r from-40% from-[#AFEAFD] to-white ">
        <div className={`
            w-[40rem] aspect-video shadow-gray-200 rounded-md 
            flex flex-col justify-center items-center gap-5
            bg-white bg-opacity-30
        `}>
            <div className="text-2xl font-bold text-gray-500">
                {
                    mode === "login"
                    ? "Login to "
                    : "Register to "
                } 
                <span className="text-gray-600">Vaultee</span>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <MyInput placeholder="Username" value={username} setValue={setUsername}/>
                    <MyInput placeholder="Password" value={password} setValue={setPassword}/>
                    {
                        mode === "register" && 
                            <MyInput 
                                placeholder="Repeat Password"
                                value={repeatPassword} 
                                setValue={setRepeatPassword}
                            />
                    }
                </div>
                <div className="flex flex-col gap-1">
                    <MyButton 
                        text={ mode === "login" ? "Login" : "Register" } 
                        className="w-full py-2"
                        onClick={entryClicked}
                    />
                    <div className="text-sm flex justify-center gap-1">
                        <span className="text-gray-500">
                            {
                                mode === "login"
                                ? "Don't have an account?"
                                : "Already have an account?"
                            }    
                        </span>
                        <button className="text-blue-500 cursor-pointer" onClick={onModeChange}>
                            {
                                mode === "login"
                                ? " Register"
                                : " Login"
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
