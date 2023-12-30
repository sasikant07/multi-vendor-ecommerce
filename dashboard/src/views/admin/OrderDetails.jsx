import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  admin_order_status_update,
  get_admin_order,
  messageClear,
} from "../../store/Reducers/orderReducer";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { order, successMessage, errorMessage } = useSelector(
    (state) => state.order
  );
  const [status, setStatus] = useState("");

  const status_update = (e) => {
    dispatch(
      admin_order_status_update({
        orderId,
        info: { status: e.target.value },
      })
    );
    setStatus(e.target.value);
  };

  useEffect(() => {
    dispatch(get_admin_order(orderId));
  }, [orderId]);

  useEffect(() => {
    setStatus(order?.delivery_status);
  }, [order]);

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
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl text-[#d0d2d6]">Order Details</h2>
          <select
            onChange={status_update}
            value={status}
            className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
            name=""
            id=""
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Placed">Placed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="p-4">
          <div className="flex gap-2 text-lg text-[#d0d2d6]">
            <h2>#{order._id}</h2>
            <span>{order.date}</span>
          </div>
          <div className="flex flex-wrap">
            <div className="w-[32%]">
              <div className="pr-3 text-[#d0d2d6] text-lg">
                <div className="flex flex-col gap-1">
                  <h2 className="pb-2 font-semibold">
                    Deliver To: {order.shippingInfo?.name}
                  </h2>
                  <p>
                    <span>
                      {order.shippingInfo?.address}{" "}
                      {order.shippingInfo?.province} {order.shippingInfo?.city}{" "}
                      {order.shippingInfo?.area}
                    </span>
                  </p>
                </div>
                <div className="flex justify-start items-center gap-3">
                  <h2>Payment Status: </h2>
                  <span className="text-base">{order.payment_status}</span>
                </div>
                <span>Price: ${order.price}</span>
                <div className="mt-4 flex flex-col gap-4">
                  <div className="text-[#d0d2d6]">
                    {order.products &&
                      order.products.map((p, i) => (
                        <div className="flex gap-3 text-md" key={i}>
                          <img
                            className="w-[45px] h-[45px]"
                            src={p.images[0]}
                            alt="product image"
                          />
                          <div className="">
                            <h2>{p.name}</h2>
                            <p>
                              <span>Brand: </span>
                              <span>{p.brand}, </span>
                              <span className="text-lg">
                                Quantity: {p.quantity}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[68%]">
              <div className="pl-3">
                <div className="mt-4 flex flex-col">
                  {order?.suborder?.map((o, i) => (
                    <div className="text-[#d0d2d6] mb-6" key={i + 20}>
                      <div className="flex justify-start items-center gap-3">
                        <h2>Seller {i + 1} order: </h2>
                        <span>{o.delivery_status}</span>
                      </div>
                      {o.products.map((p, i) => (
                        <div className="flex gap-3 text-md mt-2" key={i}>
                          <img
                            className="w-[45px] h-[45px]"
                            src={p.images[0]}
                            alt=""
                          />
                          <div className="">
                            <h2>{p.name}</h2>
                            <p>
                              <span>Brand: </span>
                              <span>{p.brand}, </span>
                              <span className="text-lg">
                                Quantity: {p.quantity}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
