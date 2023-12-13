import { useSession, signIn } from "next-auth/react";
import { Navbar, PageLoader } from "@/components";
import { FaGoogle } from "react-icons/fa";
import { HiBars3 } from "react-icons/hi2";
import { useState } from "react";

const Layout = ({ children }) => {
  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);
  
  // if session is loading, render the page loader
  if (session === undefined) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  // if session exists, render the children
  if (session) {
    return (
      <div className="flex h-screen w-screen overflow-hidden">
        <button
          onClick={() => setShowNav(!showNav)}
          className="navbar-toggler md:hidden"
        >
          <HiBars3 className="h-8 w-8" />
        </button>
        <Navbar isOpen={showNav} />
        <div className="grow p-4 overflow-y-auto">{children}</div>
      </div>
    );
  }


  // if session doesn't exist (is null), render the sign in page
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="max-w-sm overflow-hidden rounded-lg border border-gray-300 bg-white">
        <div className="space-y-2 px-4 py-5">
          <div className="flex items-center justify-center">
            <img
              alt="Google Logo"
              height={48}
              src="https://seeklogo.com/images/G/google-logo-28FA7991AF-seeklogo.com.png"
              style={{
                aspectRatio: "48/48",
                objectFit: "cover",
              }}
              width={48}
            />
            <h2 className="ml-4 text-2xl font-bold">Google Sign In</h2>
          </div>
        </div>
        <div className="space-y-4 px-4 py-5">
          <button
            onClick={() => signIn("google")}
            className="flex w-full items-center justify-center rounded border border-gray-300 px-3 py-2 hover:bg-gray-200"
            type="button"
          >
            <FaGoogle className="mr-2 h-5 w-5" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;
