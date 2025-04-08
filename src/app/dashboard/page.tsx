import {Lexend as FontSans, Manrope as FontManrope, Newsreader as FontSerif,} from "next/font/google"

import {cn} from "@/lib/utils"
import DashboardScreen from "@/app/screens/DashboardScreen";

const fontSans = FontSans({subsets: ["latin"], variable: "--font-sans"})
const fontSerif = FontSerif({subsets: ["latin"], variable: "--font-serif"})
const fontManrope = FontManrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export default function DashboardPage() {
  return (
    <div
      className={cn(
        "bg-muted dark:bg-background flex flex-1 flex-col items-center justify-center gap-16 p-6 md:p-10 h-screen",
        fontSans.variable,
        fontSerif.variable,
        fontManrope.variable
      )}
    >
      <div className="w-full max-w-sm md:max-w-3xl">
        <DashboardScreen/>
      </div>
    </div>
  );
}