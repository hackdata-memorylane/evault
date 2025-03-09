import { useState } from "react";
import MyInput from "../utils/MyInput";
import MyButton from "../utils/MyButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAtomValue, useSetAtom } from "jotai";
import { atomNewDocModalVisible, atomUser, atomUserAdmin } from "../../atoms";
import { FileUploader } from "react-drag-drop-files";

export default function NewDocModal() {
    const userAdmin = useAtomValue(atomUserAdmin);
    const setNewDocModalVisible = useSetAtom(atomNewDocModalVisible);

    const [patientId, setPatientId] = useState("");
    const [patientName, setPatientName] = useState("");
    const [patientAge, setPatientAge] = useState("");
    
    const [doctorName, setDoctorName] = useState("");

    const [details, setDetails] = useState("");
    
    const [file, setFile] = useState<File | null>(null);


    function closeModal() {
        setNewDocModalVisible(false);
    }

    function handleFileUpload(file: File) {
        setFile(file);
    }

    async function handleSubmit() {
        if (!file) {
            alert("Please upload a file!");
            return;
        }

        const formData = new FormData();

        formData.append("file", file);
        formData.append("patientId", patientId);
        formData.append("patientName", patientName);
        formData.append("patientAge", patientAge);
        formData.append("doctorName", doctorName);
        formData.append("details", details);
        formData.append("hospitalId", userAdmin!.uid);
        formData.append("hospitalName", userAdmin!.name);

        try {
            const response = await fetch("http://localhost:3000/uploadBlock", {
                method: "POST",
                body: formData,
            });
            console.log(response);

            if (response.ok) {
                alert("Document uploaded successfully!");
                closeModal();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error uploading document:", error);
            alert("An error occurred while uploading the document.");
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center">
            <div className="bg-white p-10 rounded-md w-[30rem] flex flex-col">
                <div className="flex justify-between">
                    <div className="font-[600] text-xl">New Medical Record</div>
                    <button onClick={closeModal}>
                        <FontAwesomeIcon icon={faTimes} className="ml-auto" />
                    </button>
                </div>
                <div className="flex flex-col gap-5 mt-5">
                    <MyInput 
                        placeholder="Patient's Id" 
                        value={patientId} 
                        setValue={setPatientId} 
                    />
                    <MyInput 
                        placeholder="Patient's Name" 
                        value={patientName} 
                        setValue={setPatientName} 
                    />
                    <MyInput 
                        placeholder="Patient's Age" 
                        value={patientAge} 
                        setValue={setPatientAge} 
                    />
                    <MyInput 
                        placeholder="Doctor's Name" 
                        value={doctorName} 
                        setValue={setDoctorName}
                    />
                    <textarea
                        className="border border-gray-200 px-3 py-2 rounded-md outline-none resize-none"
                        placeholder="Details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                    />
                    <div>
                        <FileUploader
                            handleChange={handleFileUpload}
                            types={["PDF"]}
                            multiple={false}
                            uploadedLabel={file ? file.name : "Upload PDF"}
                            name="file"
                        />
                    </div>
                    <div className="text-[10px] text-gray-500 my-[-.5rem]">* Not required</div>
                    <div className="flex justify-end">
                        <MyButton
                            text="Create"
                            className="px-3 py-2 font-[500]"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}


