export default function Navbar() {

    function goToHome() {
        if (window.location.pathname.includes("entry")) {
            window.location.href = "/";
            return;
        }
    }

    return <nav className={`
        absolute w-full flex flex-[1] gap-5 items-center px-5 
        bg-transparent bg-gradient-to-r from-[#AFEAFD] to-white shadow-lg
    `}>
        <div onClick={goToHome} className="cursor-pointer">
            <img src="/logo.png" alt="logo" className="w-20 h-20" />
        </div>
        <div className="text-xl font-bold transform translate-x-[-15%] cursor-pointer" onClick={goToHome}>
            Vaultee
        </div>
    </nav>
}
