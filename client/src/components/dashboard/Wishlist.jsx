import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import Ratings from "../Ratings";

const Wishlist = () => {
  return (
    <div className='w-full grid grid-cols-4 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6'>
      {[1, 2, 3, 4, 5, 6, 7].map((p, i) => (
        <div
          className="border group transition-all duration-500 hover:shadow-md hover:-mt-3 bg-white"
          key={i}
        >
          <div className="relative overflow-hidden">
            <div className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
              15%
            </div>

            <img
              className="sm:h-full w-full h-[240px]"
              src={`http://localhost:3000/images/products/${p}.webp`}
              alt={""}
            />
            <ul className="flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3">
              <li className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#7fad39] hover:text-white hover:rotate-[720deg] transition-all ">
                <AiFillHeart />
              </li>
              <Link
                to="/product/details/t-shirt"
                className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#7fad39] hover:text-white hover:rotate-[720deg] transition-all "
              >
                <FaEye />
              </Link>
              <li className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#7fad39] hover:text-white hover:rotate-[720deg] transition-all ">
                <AiOutlineShoppingCart />
              </li>
            </ul>
          </div>
          <div className="py-3 text-slate-600 px-2">
            <h2>Mens White T-Shirt</h2>
            <div className="flex justify-start items-center gap-3">
              <span className="text-lg font-bold">$1499</span>
              <div className="flex">
                <Ratings ratings={4.5} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
