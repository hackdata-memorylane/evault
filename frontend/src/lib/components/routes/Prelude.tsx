import { useState } from "react";
import MyButton from "../utils/MyButton";

export default function Prelude() {
    const [started, setStarted] = useState(false);

    return <div className="">
        <div className={`
            bg-gradient-to-r from-40% from-[#AFEAFD] to-white h-screen flex justify-stretch
            items-end p-20
            ${started ? "hidden" : ""}
        `}>
            <div className="flex flex-col gap-5">
                <div className="text-[45px] font-bold px-3 pl-0">
                    Your Medical Records, Secure & Accessible Anytime.
                </div>
                <div>
                    <MyButton text="Get Started" onClick={() => setStarted(true)} />  
                </div>
            </div>
            <div>
                <img className="w-[1100px] transform translate-x-[15%] translate-y-[10%]" src="/giffy.gif" alt="gif" />
            </div>
        </div>

        <div className={`
            bg-gradient-to-r from-40% from-[#AFEAFD] to-white h-screen flex flex-col
            justify-center items-center w-full  gap-10
            ${started ? "" : "hidden"}
        `}>
            <div className="text-[45px] font-bold">
                Getting Started
            </div>
            <div className="flex gap-8">
                <div>
                    <MyButton text="Login as Patient" className="h-32 shadow-lg" href="/entrypatient" />
                </div>
                <div>
                    <MyButton text="Login as Admin" className="h-32 shadow-lg" href="/entryadmin" />
                </div>
            </div>
        </div>
    </div>
}
