import { signIn } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import urljoin from "url-join";

const LoginWithFacebookButton = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        signIn("facebook", {
          callbackUrl: router.query.redirect
            ? urljoin("http://localhost:3000", router.query.redirect as string)
            : "/app",
        });
      }}
      className="flex-1 text-[13px] text-indigo-700 border p-2 rounded-md font-semibold flex justify-center items-center hover:bg-gray-50 transition-colors"
    >
      <img
        alt="Google"
        className="w-6 h-6 object-contain mr-3"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
      />
      Login with Facebook
    </button>
  );
};

export default LoginWithFacebookButton;
