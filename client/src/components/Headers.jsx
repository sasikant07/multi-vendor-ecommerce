import React, { useState } from "react";
import { GrMail } from "react-icons/gr";
import {
  FaFacebook,
  FaLinkedinIn,
  FaList,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { AiOutlineTwitter, AiFillGithub } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const Headers = () => {
  const {pathname} = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const user = true;
  return (
    <div className="w-full bg-white">
      <div className="header-top bg-[#eeeeee] md-lg:hidden">
        <div className="w-[85%] lg:w-[90%] mx-auto">
          <div className="flex w-full justify-between items-center h-[50px] text-slate-500">
            <ul className="flex justify-start items-center gap-8">
              <li className="flex relative justify-center items-center gap-2 text-sm after:absolute after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px]">
                <span>
                  <GrMail />
                </span>
                <span>johndoe@gmail.com</span>
              </li>
              <span>Multi vendor e-commerce</span>
            </ul>
            <div className="">
              <div className="flex justify-center items-center gap-10">
                <div className="flex justify-center items-center gap-4">
                  <a href="#">
                    <FaFacebook />
                  </a>
                  <a href="#">
                    <AiOutlineTwitter />
                  </a>
                  <a href="#">
                    <FaLinkedinIn />
                  </a>
                  <a href="#">
                    <AiFillGithub />
                  </a>
                </div>
                <div className="flex group cursor-pointer text-slate-800 text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px] after:absolute before:absolute before:h-[18px] before:bg-[#afafaf] before:w-[1px] before:-left-[20px]">
                  <img src="http://localhost:3000/images/language.png" alt="" />
                  <span>
                    <MdOutlineKeyboardArrowDown />
                  </span>
                  <ul className="absolute invisible transition-all top-12 rounded-sm duration-200 text-white p-2 w-[100px] flex flex-col gap-3 group-hover:visible group-hover:top-6 group-hover:bg-black z-10">
                    <li>English</li>
                    <li>Hindi</li>
                  </ul>
                </div>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="flex cursor-pointer justify-center items-center gap-2 text-sm"
                  >
                    <span>
                      <FaUser />
                    </span>
                    <span>John Doe</span>
                  </Link>
                ) : (
                  <div className="flex cursor-pointer justify-center items-center gap-2 text-sm">
                    <span>
                      <FaLock />
                    </span>
                    <span>Login</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-white">
        <div className="w-[85%] lg:w-[90%] mx-auto">
          <div className="h-[80px] md-lg:h-[100px] flex justify-between items-center flex-wrap">
            <div className="md-lg:w-full w-3/12 md-lg:pt-4">
              <div className="flex justify-between items-center">
                <Link to="/">
                  <img src="http://localhost:3000/images/logo.png" alt="logo" />
                </Link>
                <div
                  className="justify-center items-center w-[30px] h-[30px] bg-white text-slate-600 border border-slate-600 rounded-sm cursor-pointer lg:hidden md-lg:flex xl:hidden hidden"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <span>
                    <FaList />
                  </span>
                </div>
              </div>
            </div>
            <div className="md-lg:w-full w-9/12">
              <div className="flex justify-between md-lg:justify-center items-center flex-wrap pl-8">
                  <ul className="flex justify-start items-start gap-8 text-sm font-bold uppercase md-lg:hidden">
                    <li>
                      <Link className={`p-2 block ${pathname === "/" ? "text-[#75ad39]" : "text-slate-600"}`}>Home</Link>
                    </li>
                    <li>
                      <Link className={`p-2 block ${pathname === "/shop" ? "text-[#75ad39]" : "text-slate-600"}`}>Shop</Link>
                    </li>
                    <li>
                      <Link className={`p-2 block ${pathname === "/blog" ? "text-[#75ad39]" : "text-slate-600"}`}>Blog</Link>
                    </li>
                    <li>
                      <Link className={`p-2 block ${pathname === "/about" ? "text-[#75ad39]" : "text-slate-600"}`}>About</Link>
                    </li>
                    <li>
                      <Link className={`p-2 block ${pathname === "/contact" ? "text-[#75ad39]" : "text-slate-600"}`}>Contact</Link>
                    </li>
                  </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Headers;
