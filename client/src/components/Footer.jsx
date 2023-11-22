import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#F3F6Fa]">
      <div className="w-[85%] flex flex-wrap mx-auto border-b py-16 md-lg:pb-10 sm:pb-6">
        <div className="w-3/12 lg:w-4/12 sm:w-full">
            <div className="flex flex-col gap-3">
                <img className="w-[190px] h-[70px]" src="http://localhost:3000/images/logo.png" alt="logo" />
                <ul className="flex flex-col gap-2 text-slate-600">
                    <li>Address: Los Angeles, Cupertino</li>
                    <li>Phone: +1 (768)-2345670</li>
                    <li>Email: awesomewebapps@gmail.com</li>
                </ul>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
