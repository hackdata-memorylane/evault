import { useState } from "react";
import { DocLeafProps } from "../../../../types";



export default function DocLeaf(props: DocLeafProps) {
    const [expanded, setExpanded] = useState(false);

    return <div 
        onClick={() => setExpanded(!expanded)}
        className="flex flex-col mx-32 px-10 bg-white opacity-50 font-bold border shadow-lg rounded-md my-5 p-5 cursor-pointer"
    >
        <div className="flex justify-between">
            <div> Dr. {props.doctorName} </div>       
            <div> {props.hospitalName} </div>
            <div> {
                new Date(props.timestamp).toLocaleDateString()
            } </div>
        </div>
        { expanded ? <div> 
            <br/>
            <div className="text-sm">Description:</div>
            {props.details}
        </div> : "" }
    </div>
}
