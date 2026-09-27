import Link from "next/link";
import { Telescope, Compass } from "lucide-react";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export default function NotFound() {
  return (
    <div className={`${montserrat.variable} min-h-screen bg-[oklch(0.98_0.01_163)] flex items-center justify-center p-4 sm:p-8 overflow-hidden relative font-sans`}>
      {/* Background blobs for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[oklch(0.95_0.05_163)] rounded-full blur-[100px] pointer-events-none opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[oklch(0.85_0.13_165)] rounded-full blur-[100px] pointer-events-none opacity-50"></div>

      <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/80 p-8 sm:p-12 lg:p-20 z-10 relative overflow-hidden">
        
        {/* Left Content */}
        <div className="space-y-6 text-center lg:text-left order-2 lg:order-1 relative z-20">
          <div className="space-y-1">
            <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black text-[oklch(0.38_0.07_169)] tracking-tighter drop-shadow-sm">
              404
            </h1>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[oklch(0.38_0.07_169)] tracking-tight">
              error
            </h2>
          </div>
          
          <p className="text-[oklch(0.51_0.1_166)] text-lg sm:text-xl max-w-sm mx-auto lg:mx-0 font-medium leading-relaxed pt-2">
            The page you are looking for was moved, removed, renamed or might never existed.
          </p>
          
          <div className="pt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-[oklch(0.7_0.12_183)] text-white font-bold text-sm uppercase tracking-widest hover:bg-[oklch(0.51_0.1_166)] hover:shadow-xl hover:shadow-[oklch(0.7_0.12_183)]/30 hover:-translate-y-1 transition-all duration-300"
            >
              Go To Homepage
            </Link>
          </div>
        </div>

        {/* Right Content / Illustration */}
        <div className="relative flex items-center justify-center order-1 lg:order-2 min-h-[300px] sm:min-h-[400px]">
          <div className="relative z-10 flex flex-col items-center">
            
            {/* 404 Visual Art */}
            <div className="relative flex items-end justify-center mb-8 sm:mb-12">
              <span className="text-[120px] sm:text-[180px] font-black text-white drop-shadow-[0_20px_30px_rgba(0,0,0,0.08)] leading-none select-none z-10">
                4
              </span>
              
              {/* Center icon mimicking the person/telescope */}
              <div className="relative z-30 bg-white rounded-full p-5 sm:p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border-[8px] border-[oklch(0.95_0.05_163)] mx-[-20px] sm:mx-[-30px] translate-y-4 animate-[bounce_4s_infinite]">
                <Telescope className="w-12 h-12 sm:w-20 sm:h-20 text-[oklch(0.7_0.12_183)]" strokeWidth={1.5} />
                
                {/* Decorative dots around telescope */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-[oklch(0.7_0.12_183)] rounded-full animate-ping"></div>
              </div>
              
              <span className="text-[120px] sm:text-[180px] font-black text-white drop-shadow-[0_20px_30px_rgba(0,0,0,0.08)] leading-none select-none z-10">
                4
              </span>
            </div>

            {/* Clouds/Water reflection mimicking the image base */}
            <div className="absolute bottom-[-20px] sm:bottom-[-40px] flex flex-col items-center w-full select-none z-0">
              <div className="w-[120%] sm:w-[150%] h-16 sm:h-24 bg-[oklch(0.95_0.05_163)] rounded-[100%] opacity-90 blur-[2px]"></div>
              <div className="w-[90%] sm:w-[110%] h-10 sm:h-12 bg-[oklch(0.85_0.13_165)] rounded-[100%] mt-[-30px] opacity-80 blur-[4px]"></div>
            </div>

            {/* Floating elements */}
            <Compass className="absolute top-0 right-10 w-10 h-10 text-[oklch(0.7_0.12_183)] opacity-60 animate-[pulse_3s_infinite]" />
            <div className="absolute top-20 left-0 w-6 h-6 bg-[oklch(0.85_0.13_165)] rounded-full animate-bounce opacity-80" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
