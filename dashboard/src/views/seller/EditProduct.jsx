import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BsImages } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import toast from "react-hot-toast";
import { get_category } from "../../store/Reducers/categoryReducer";
import {
  get_product,
  messageClear,
  update_product,
  product_image_update,
} from "../../store/Reducers/productReducer";

const initialState = {
  name: "",
  description: "",
  discount: "",
  price: "",
  brand: "",
  stock: "",
};

const EditProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { product, loader, errorMessage, successMessage } = useSelector(
    (state) => state.product
  );
  const [state, setState] = useState(initialState);
  const [categoryShow, setCategoryShow] = useState(false);
  const [category, setCategory] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState("");
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
      dispatch(
        product_image_update({
          oldImage: img,
          newImage: files[0],
          productId,
        })
      );
    }
  };

  const updateProduct = (e) => {
    e.preventDefault();
    const obj = {
      name: state.name,
      description: state.description,
      discount: state.discount,
      price: state.price,
      brand: state.brand,
      stock: state.stock,
      productId: productId,
    };
    dispatch(update_product(obj));
  };

  useEffect(() => {
    setState({
      name: product.name,
      description: product.description,
      discount: product.discount,
      price: product.price,
      brand: product.brand,
      stock: product.stock,
    });
    setCategory(product.category);
    setImageShow(product.images);
  }, [product]);

  useEffect(() => {
    dispatch(
      get_category({
        searchValue: "",
        perPage: "",
        page: "",
      })
    );
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setAllCategory(categories);
    }
  }, [categories]);

  useEffect(() => {
    dispatch(get_product(productId));
  }, [productId]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

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
          <form onSubmit={updateProduct}>
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
                  <div className="flex justify-start items-start flex-col h-[200px] overflow-x-auto">
                    {allCategory?.map((c, i) => (
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
                <label htmlFor="description">Description</label>
                <textarea
                  onChange={inputHandle}
                  rows={4}
                  value={state.description}
                  className="px-4 py-2 w-full focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  name="description"
                  id="description"
                  placeholder="Description"
                ></textarea>
              </div>
            </div>
            <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 w-full text-[#d0d2d6] mb-4">
              {imageShow?.map((img, i) => (
                <div className="h-[180px]">
                  <label htmlFor={i}>
                    <img className="w-full h-full" src={img} alt="" />
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
              <button
                disabled={loader ? true : false}
                className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                ) : (
                  "Update Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
