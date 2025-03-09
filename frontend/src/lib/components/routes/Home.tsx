import { useSetAtom } from "jotai";
import { atomNewDocModalVisible } from "../../atoms";
import MyButton from "../utils/MyButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faSignOut } from "@fortawesome/free-solid-svg-icons";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function Home() {
    const setNewDocModalVisible = useSetAtom(atomNewDocModalVisible);
    const [_localStorage, setLocalStorage] = useLocalStorage("sessionid", "");

    function logout() {
        setLocalStorage("");
        // open the "/" route
        window.location.href = "/";
    }

    return <div className="bg-gradient-to-r from-[#AFEAFD] to-white h-screen pt-20">
        <div className="flex justify-between p-5 px-10">
            <div className="flex gap-4">
                <button className="text-blue-700 text-lg">
                    Select all
                </button>
                <MyButton text="Summarize" className="py-1 bg-gradient-to-r from-cyan-500 to-cyan-300" />
            </div>

            <div className="flex gap-4 items-center">
                <MyButton text="Grant Access" className="py-1"/>
                <MyButton text="Revoke Access" className="py-1 bg-red-600"/>
                <FontAwesomeIcon icon={faSignOut} className="text-lg cursor-pointer" onClick={logout}/>
            </div>
        </div>
    </div>
}
