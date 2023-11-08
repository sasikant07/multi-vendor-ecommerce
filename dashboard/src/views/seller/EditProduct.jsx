import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsImages } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";

const initialState = {
  name: "",
  descrition: "",
  discount: "",
  price: "",
  brand: "",
  stock: "",
};

const categories = [
  {
    id: 1,
    name: "Sports",
  },
  {
    id: 2,
    name: "Shirts",
  },
  {
    id: 3,
    name: "Shoes",
  },
  {
    id: 4,
    name: "Trousers",
  },
  {
    id: 5,
    name: "Accessories",
  },
];

const EditProduct = () => {
  const [state, setState] = useState(initialState);
  const [categoryShow, setCategoryShow] = useState(false);
  const [category, setCategory] = useState("");
  const [allCategory, setAllCategory] = useState(categories);
  const [searchValue, setSearchValue] = useState("");
  const [images, setImages] = useState([]);
  const [imageShow, setImageShow] = useState([]);

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value) {
      let srcValue = allCategory.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllCategory(srcValue);
    } else {
      setAllCategory(categories);
    }
  };

  const changeImage = (img, files) => {
    if (files.length > 0) {
      
    }
  };

  useEffect(() => {
    setState({
      name: "Men's Premium T-Shirt",
      descrition: "Men's Premium T-Shirt",
      discount: 10,
      price: 123,
      brand: "Nike",
      stock: 100,
    });
    setCategory("Shirts");
    setImageShow([
      "http://localhost:3000/images/admin.jpg",
      "http://localhost:3000/images/admin.jpg",
    ]);
  }, []);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#d0d2d6] text-xl font-semibold">Edit Product</h1>
          <Link
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2"
            to="/seller/dashboard/products"
          >
            Products
          </Link>
        </div>
        <div className="">
          <form>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="name">Product Name</label>
                <input
                  onChange={inputHandle}
                  value={state.name}
                  className="px-4 py-2 w-full focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Product name"
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="brand">Brand</label>
                <input
                  onChange={inputHandle}
                  value={state.brand}
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  type="text"
                  name="brand"
                  id="brand"
                  placeholder="Brand name"
                />
              </div>
            </div>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1 relative">
                <label htmlFor="category">Category</label>
                <input
                  readOnly
                  onClick={() => setCategoryShow(!categoryShow)}
                  value={category}
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  type="text"
                  id="category"
                  placeholder="select category"
                />
                <div
                  className={`absolute top-[101%] bg-slate-800 w-full transition-all ${
                    categoryShow ? "scale-100" : "scale-0"
                  }`}
                >
                  <div className="w-full px-4 py-2 fixed">
                    <input
                      onChange={categorySearch}
                      value={searchValue}
                      className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                      type="text"
                      placeholder="search"
                    />
                  </div>
                  <div className="pt-14"></div>
                  <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scrooll">
                    {allCategory.map((c, i) => (
                      <span
                        className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                          category === c.name && "bg-indigo-500"
                        }`}
                        onClick={() => {
                          setCategoryShow(false);
                          setCategory(c.name);
                          setSearchValue("");
                          setAllCategory(categories);
                        }}
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="stock">Stock</label>
                <input
                  onChange={inputHandle}
                  value={state.stock}
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  type="number"
                  min={0}
                  name="stock"
                  id="stock"
                  placeholder="Brand name"
                />
              </div>
            </div>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="price">Price</label>
                <input
                  onChange={inputHandle}
                  value={state.price}
                  className="px-4 py-2 w-full focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  type="number"
                  min={0}
                  name="price"
                  id="price"
                  placeholder="Price"
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="discount">Discount</label>
                <input
                  onChange={inputHandle}
                  value={state.discount}
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  type="number"
                  name="discount"
                  id="discount"
                  placeholder="Discount %"
                />
              </div>
            </div>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1 mb-2">
                <label htmlFor="descrition">Descrition</label>
                <textarea
                  onChange={inputHandle}
                  rows={4}
                  value={state.descrition}
                  className="px-4 py-2 w-full focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  name="descrition"
                  id="descrition"
                  placeholder="Description"
                ></textarea>
              </div>
            </div>
            <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 w-full text-[#d0d2d6] mb-4">
              {imageShow.map((img, i) => (
                <div className="">
                  <label htmlFor={i}>
                    <img src={img} alt="" />
                  </label>
                  <input
                    onChange={(e) => changeImage(img, e.target.files)}
                    type="file"
                    id={i}
                    className="hidden"
                  />
                </div>
              ))}
            </div>
            <div className="flex ">
              <button className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 my-2">
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;