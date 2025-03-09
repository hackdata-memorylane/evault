import Prelude from "./lib/components/routes/Prelude"
import { Routes, Route, useNavigate } from "react-router-dom"
import Home from "./lib/components/routes/Home"
import { useEffect } from "react"
import { EntryResponse, EntryResponseAdmin } from "../types"
import { getLocal } from "./lib/helpers"
import { atomNewDocModalVisible, atomUser, atomUserAdmin } from "./lib/atoms"
import { useAtom, useAtomValue } from "jotai"
import Navbar from "./lib/components/standalone/Navbar"
import NewDocModal from "./lib/components/standalone/NewDocModal"
import Entry from "./lib/components/routes/Entry"
import EntryAdmin from "./lib/components/routes/EntryAdmin"
import ForAdminHome from "./lib/components/routes/forAdminHome"
import useLocalStorage from "./lib/hooks/useLocalStorage"

function App() {
    const [_user, setUser] = useAtom(atomUser);
    const [_userAdmin, setUserAdmin] = useAtom(atomUserAdmin);
    const navigate = useNavigate();
    const path = window.location.pathname;
    const newDocModalVisible = useAtomValue(atomNewDocModalVisible);
    const [localStorage, setLocalStorage] = useLocalStorage("adminLogin", "") as unknown as string;

    useEffect(() => {
        if (path.includes("forAdmin")) {
            const { hospitalId, password } = JSON.parse(localStorage);
            fetch("http://localhost:3000/loginAdmin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    hospitalId,
                    password
                })
            }).then(res => res.json()).then((data: EntryResponseAdmin) => {
                if (data.err) {
                    navigate("/");
                    return;
                }
                
                setUserAdmin(data.success);
            }).catch(() => {
                navigate("/");
                //console.log("Error");
            })
        } else {
            fetch(`http://localhost:3000/autologin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sessionId: getLocal("sessionid")
                })
            }).then(res => res.json()).then((data: EntryResponse) => {
                if (data.err && (path !== "/" && !path.startsWith("/entry"))) {
                    return;
                };

                if (path === "/" || path.startsWith("/entry")) {
                    return;
                }
                setUser(data.success);
            }).catch(() => {
                //console.log("Error");
            })
        }
    }, [])

    return <div className="h-screen">
        <Navbar />
        <div className="flex-[3.5]">
            <Routes>
                <Route path="/" element={<Prelude />} />
                <Route path="/entrypatient" element={<Entry />} />
                <Route path="/entryadmin" element={<EntryAdmin />} />
                <Route path="/home" element={<Home/>} />
                <Route path="/forAdminHome" element={<ForAdminHome />} />
            </Routes>
        </div>
        {
            newDocModalVisible && <NewDocModal />
        }
    </div>
}

export default App
