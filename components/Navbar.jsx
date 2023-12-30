import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import {
  AiOutlineShop,
  AiOutlineHome,
  AiOutlineUnorderedList,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FiPackage } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import NavLink from "@/components/NavLink";

const Navbar = ({ isOpen }) => {
  const linkClass = "flex gap-2 p-1 items-center hover:bg-gray-300";
  const activeLinkClass = "flex gap-2 p-1 items-center bg-sky-400 rounded-sm";
  const router = useRouter();
  const { pathname } = router;

  const navLinksData = [
    { to: "/products", icon: AiOutlineShoppingCart, text: "Products" },
    { to: "/categories", icon: AiOutlineUnorderedList, text: "Categories" },
    { to: "/orders", icon: FiPackage, text: "Orders" },
    { to: "/admins", icon: MdOutlineAdminPanelSettings, text: "Admins" },
    { to: "/settings", icon: IoSettingsOutline, text: "Settings" },
  ];

  const logOut = async () => {
    await router.push("/");
    await signOut();
  };

  return (
    <aside
      className={
        (isOpen ? "top-0" : "-top-full") +
        " absolute h-full w-full bg-gray-200 p-3 transition-all duration-150 ease-in-out md:w-auto md:static" 
      }
    >
      <Link
        href={"/"}
        className="mb-4 mr-4 flex items-center justify-center gap-1 border-b border-gray-300 font-semibold"
      >
        <AiOutlineShop className="h-8 w-8" />
        <span className="whitespace-nowrap">Admin Panel</span>
      </Link>

      <nav className="flex flex-col gap-3 py-2 text-base">
        <Link
          href={"/"}
          className={pathname === "/" ? activeLinkClass : linkClass}
        >
          <AiOutlineHome className="navbar-icon" />
          Dashboard
        </Link>

        {navLinksData.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            pathname={pathname}
            icon={link.icon}
            text={link.text}
            activeLinkClass={activeLinkClass}
            linkClass={linkClass}
          />
        ))}

        <button onClick={() => logOut()} className={linkClass}>
          <VscSignOut className="navbar-icon" />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Navbar;
