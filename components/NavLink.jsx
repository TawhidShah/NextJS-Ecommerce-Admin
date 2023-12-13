import React from "react";
import Link from "next/link";

const NavLink = ({ to, pathname, icon, text, activeLinkClass, linkClass } ) => {
  return (
    <Link href={to} passHref
       className={pathname.includes(to) ? activeLinkClass : linkClass}>
        {React.createElement(icon, { className: "navbar-icon" })}
        {text}
    </Link>
  );
};

export default NavLink;
