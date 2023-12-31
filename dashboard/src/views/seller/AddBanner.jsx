import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import {
  add_banner,
  get_banner,
  messageClear,
  update_banner,
} from "../../store/Reducers/bannerReducer";

const AddBanner = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage, banner } = useSelector(
    (state) => state.banner
  );
  const [show, setShow] = useState(false);
  const [imageShow, setImageShow] = useState("");
  const [image, setImage] = useState("");

  const imageHandle = (e) => {
    const files = e.target.files;
    const length = files.length;

    if (length > 0) {
      setImage(files[0]);
      setImageShow(URL.createObjectURL(files[0]));
    }
  };

  const add = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("image", image);

    dispatch(add_banner(formData));
  };

  const update = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    dispatch(update_banner({ info: formData, bannerId: banner._id }));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setImageShow("");
      setImage("");
      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    dispatch(get_banner({ productId }));
  }, [productId]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#d0d2d6] text-xl font-semibold">Add Banner</h1>
          <Link
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2"
            to="/seller/dashboard/banners"
          >
            Banners
          </Link>
        </div>
        {!banner && (
          <div className="">
            <form onSubmit={add}>
              <div className="mb-6">
                <label
                  htmlFor="image"
                  className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-indigo-500 w-full text-[#d0d2d6]"
                >
                  <span className="text-4xl">
                    <FiUpload />
                  </span>
                  <span>Select Banner Image</span>
                </label>
                <input
                  onChange={imageHandle}
                  className="hidden"
                  type="file"
                  id="image"
                  required
                />
              </div>
              {imageShow && (
                <div className="mb-4">
                  <img
                    className="w-full h-auto "
                    src={imageShow}
                    alt="banner"
                  />
                </div>
              )}
              <button
                disabled={loader ? true : false}
                className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                ) : (
                  "Add Banner"
                )}
              </button>
            </form>
          </div>
        )}
        {banner && (
          <div className="">
            {
              <div className="mb-4">
                <img
                  className="w-full h-auto "
                  src={banner.banner}
                  alt="banner"
                />
              </div>
            }
            <form onSubmit={update}>
              <div className="mb-6">
                <label
                  htmlFor="image"
                  className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-indigo-500 w-full text-[#d0d2d6]"
                >
                  <span className="text-4xl">
                    <FiUpload />
                  </span>
                  <span>Select Banner Image</span>
                </label>
                <input
                  onChange={imageHandle}
                  className="hidden"
                  type="file"
                  id="image"
                  required
                />
              </div>
              {imageShow && (
                <div className="mb-4">
                  <img
                    className="w-full h-auto "
                    src={imageShow}
                    alt="banner"
                  />
                </div>
              )}
              <button
                disabled={loader ? true : false}
                className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                ) : (
                  "Update Banner"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBanner;
