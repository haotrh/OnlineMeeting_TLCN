import Link from "next/link";
import { FaMicrophoneSlash } from "react-icons/fa";
import { RiComputerFill, RiPhoneFill } from "react-icons/ri";

const Hero = () => {
  return (
    <>
      <div
        id="home"
        className="flex flex-col justify-center items-center relative"
      >
        <h1
          className="flex flex-col text-center text-5xl
        font-black text-darkblue space-y-5 mb-8"
        >
          <span>Anytime, Anywhere</span>
          <span>Learn on your Schedule</span>
        </h1>
        <h3 className="max-w-lg text-center text-gray-500 leading-7 mb-7">
          We believe everyone the capacity to be creative Educate is a place
          where people develop their own potential.
        </h3>
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="w-[5px] h-[5px] rounded-full bg-yellow-500 absolute" />
          <div className="w-[8px] h-[8px] rounded-full bg-green-400 absolute top-[-40px] left-[calc(50%+40px)]" />
          <div className="w-[5px] h-[5px] rounded-full bg-blue-500 absolute bottom-2 left-[25%]" />
          <div className="w-[8px] h-[8px] rounded-full bg-red-400 absolute bottom-[20px] left-[calc(100%+40px)]" />
          <div
            className="absolute p-1.5 bg-teal-100/50 border-2 left-[-20%] top-[40%]
          border-teal-400 text-teal-400 rounded-full"
          >
            <RiPhoneFill />
          </div>
          <div
            className="absolute p-1 border-2 right-[10%] bottom-[6%]
          border-blue-500 text-blue-500 rounded-full rotate-[30deg] text-[13px]"
          >
            <FaMicrophoneSlash />
          </div>
          <div
            className="absolute p-2.5 bg-red-200/60 right-[-20%] top-[-20%]
          text-red-400 rounded-full rotate-[-35deg] text-xl"
          >
            <RiComputerFill />
          </div>
        </div>
      </div>
      <Link href="/register">
        <a
          className="mb-3 py-4 px-5 text-[17px] font-quicksand rounded-2xl
        from-blue-500 to-indigo-600 bg-gradient-to-r text-white font-semibold"
        >
          Get started for free
        </a>
      </Link>
      <div className="my-8 shadow-2xl">
        <img
          alt="Hero Banner"
          className="w-full max-w-4xl"
          src="https://lh3.googleusercontent.com/g6WWfSMs3V0w2hhsaoc9myxQXmfO3IcRPwIsSo7nUJkNDHFb2JT4bffBiNH50_seojxYfC3AfBz8xNHd5k7tqXVsjRVvHGfJfAPx-zz8Lk7EQ0cPuA=rwu-v1-w1400"
        />
      </div>
    </>
  );
};

export default Hero;
