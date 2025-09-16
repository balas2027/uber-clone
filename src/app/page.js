"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, IndianRupee, Handshake } from "lucide-react";
import car from "../../public/image.jpg";
import drive from "../../public/whyDriveWithUs_desktop.svg";



export default function Home() {
 
  return (
    <div className="min-h-screen w-full bg-black">
      {/* navbar */}
      <div className="bg-white sticky top-0 w-full z-10">
        <div className="flex h-12 justify-between items-center max-w-6xl px-5 sm:px-10 mx-auto">
          <div className="text-black font-semibold text-2xl">kanthan</div>
          <div className="flex flex-row items-center gap-4">
            <Link href="/help">Help</Link>
            <Link href="/login">Log in</Link>
            <Link
              href="/auth/signup"
              className="bg-black text-white py-1 px-2 rounded-4xl"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* hero */}
      <div className="py-10 px-5 md:px-10 bg-white">
        <div className="flex lg:flex-row flex-col justify-between items-center max-w-5xl mx-auto">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl sm:text-5xl font-semibold">
              Drive when you want, make what you need
            </h1>
            <h2 className="text-lg">Earn on your own schedule</h2>
            <div className="flex gap-6">
              <Link
                href="#"
                className="bg-black rounded-lg text-white py-2 px-5"
              >
                Get started
              </Link>
              <Link href="/auth/login" className="underline underline-offset-4">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
          <Image src={car} alt="" className="h-auto lg:w-140" />
        </div>
      </div>

      {/* why drive */}
      <div className="max-w-5xl px-5 mx-auto text-white flex flex-col gap-y-10 py-20">
        <h1 className="font-semibold text-3xl">Why drive with us</h1>
        <div className="flex justify-center">
          <Image src={drive} alt="" />
        </div>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex flex-col border gap-y-5 w-full md:w-1/3 border-white/30 p-3 rounded-lg">
            <Calendar />
            <h1>Set your own hours</h1>
            <h2>You decide when and how often you drive.</h2>
          </div>
          <div className="flex flex-col border gap-y-5 w-full md:w-1/3 border-white/30 p-3 rounded-lg">
            <IndianRupee />
            <h1>Get paid fast</h1>
            <h2>Weekly payments in your bank account.</h2>
          </div>
          <div className="flex flex-col border gap-y-5 w-full md:w-1/3 border-white/30 p-3 rounded-lg">
            <Handshake />
            <h1>Get support at every turn</h1>
            <h2>If there’s anything you need, you can reach us anytime.</h2>
          </div>
        </div>
      </div>
      

      <div >

      </div>
  
    </div>
  );
}
