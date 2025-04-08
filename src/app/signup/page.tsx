import {Lexend as FontSans, Manrope as FontManrope, Newsreader as FontSerif,} from "next/font/google"

import {cn} from "@/lib/utils"
import SignUpScreen from "@/app/screens/SignUpScreen";

const fontSans = FontSans({subsets: ["latin"], variable: "--font-sans"})
const fontSerif = FontSerif({subsets: ["latin"], variable: "--font-serif"})
const fontManrope = FontManrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export default function SignupPage() {
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
        <SignUpScreen
          imageUrl="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </div>
    </div>
  )
}