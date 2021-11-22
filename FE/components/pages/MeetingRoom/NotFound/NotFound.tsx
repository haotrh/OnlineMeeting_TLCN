import Link from "next/link";

export const MeetingNotFound = () => {
  return (
    <div className="min-h-screen flex-center flex-col text-gray-700">
      <div className="text-[100px] font-black">404</div>
      <div className="text-2xl font-semibold">Oops!!</div>
      <div className="text-lg font-medium">Meeting room not found</div>
      <Link href="/">
        <a
          className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all
        text-white mt-2 font-semibold font-be"
        >
          GO TO HOMEPAGE
        </a>
      </Link>
    </div>
  );
};
