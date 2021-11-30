import { signIn } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import urljoin from "url-join";
import { config } from "../../../utils/config";

const LoginWithGoogleButton = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        signIn("google", {
          callbackUrl: router.query.redirect
            ? urljoin(config.frontendUrl, router.query.redirect as string)
            : "/app",
        });
      }}
      className="flex-1 text-[13px] text-indigo-700 border p-2 rounded-md font-semibold flex justify-center items-center hover:bg-gray-50 transition-colors"
    >
      <img
        alt="Google"
        className="w-6 h-6 object-contain mr-3"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
      />
      Login with Google
    </button>
  );
};

export default LoginWithGoogleButton;
