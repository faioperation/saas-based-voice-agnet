import { Outlet, Link } from "react-router-dom";
import Password from "../components/Password";
import InputField from "../components/Inputfield";
import Image from "../components/Image";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50/50 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-300/20 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-400/20 blur-[120px]"></div>
      <div className="w-[580px] bg-white rounded-[32px] px-20 py-12 flex flex-col items-center border border-sky-100 shadow-[0_8px_30px_rgba(14,165,233,0.12)] font-montserrat relative z-10">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-6 cursor-pointer">
        <Image src="/logo.png" alt="FireVoice" className="h-10" />
      </Link>

     

     <div className="w-full">
      <Outlet/>
     </div>
    </div>
    </div>
  );
}
