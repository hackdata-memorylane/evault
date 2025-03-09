import { faPlus } from "@fortawesome/free-solid-svg-icons";
import MyButton from "../utils/MyButton";
import { atomNewDocModalVisible, atomUserAdmin } from "../../atoms";
import { useAtomValue, useSetAtom } from "jotai";

export default function ForAdminHome() {
    const adminUser = useAtomValue(atomUserAdmin);
    const setNewDocModalVisible = useSetAtom(atomNewDocModalVisible);

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

    </div>
}
