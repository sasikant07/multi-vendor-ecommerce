import React, { forwardRef, useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import moment from "moment";
import { BsCurrencyDollar } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  get_admin_payment_details,
  messageClear,
  send_withdrawl_request,
} from "../../store/Reducers/paymentReducer";

function handleOnWheel({ deltaY }) {
  console.log("HangleOnWheel", deltaY);
}

const outerElementType = forwardRef((props, ref) => (
  <div ref={ref} onWheel={handleOnWheel} {...props} />
));

const Payments = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    errorMessage,
    successMessage,
    loader,
    pendingWithdraws,
    successWithDraws,
    totalAmount,
    withdrawnAmount,
    pendingAmount,
    availableAmount,
  } = useSelector((state) => state.payment);
  const [amount, setAmount] = useState(0);

  const PendingWithdrawRow = ({ index, style }) => {
    return (
      <div style={style} className="flex text-sm">
        <div className="w-[25%] p-2 whitespace-nowrap">{index + 1}</div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          ${pendingWithdraws[index]?.amount}
        </div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          <span className="py-[1px] px-[5px] bg-slate-700 text-blue-500 rounded-md text-xs">
            {pendingWithdraws[index]?.status}
          </span>
        </div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          {moment(pendingWithdraws[index]?.createdAt).format("LL")}
        </div>
      </div>
    );
  };

  const SuccessWithdrawRow = ({ index, style }) => {
    return (
      <div style={style} className="flex text-sm">
        <div className="w-[25%] p-2 whitespace-nowrap">{index + 1}</div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          ${successWithDraws[index]?.amount}
        </div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          <span className="py-[1px] px-[5px] bg-slate-700 text-blue-500 rounded-md text-xs">
            {successWithDraws[index]?.status}
          </span>
        </div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          {moment(successWithDraws[index]?.createdAt).format("LL")}
        </div>
      </div>
    );
  };

  const sendRequest = (e) => {
    e.preventDefault();

    if (amount <= 0) {
      toast.error("Request amount should be greater than 0");
    } else if (availableAmount - amount > 10) {
      dispatch(send_withdrawl_request({ amount, sellerId: userInfo._id }));
      setAmount(0);
    } else {
      toast.error("Insufficint balance");
    }
  };

  useEffect(() => {
    dispatch(get_admin_payment_details(userInfo._id));
  }, []);

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
    <div className="px-2 md:px-7 py-5">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
            <h2 className="text-lg font-bold">$ {totalAmount}</h2>
            <span className="text-sm font-normal">Total Sales</span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl">
            <BsCurrencyDollar className="text-[#28c76f] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
            <h2 className="text-lg font-bold">$ {availableAmount}</h2>
            <span className="text-sm font-normal">Available Amount</span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#e000e81f] flex justify-center items-center text-xl">
            <BsCurrencyDollar className="text-[#cd00e8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
            <h2 className="text-lg font-bold">$ {withdrawnAmount}</h2>
            <span className="text-sm font-normal">Withdrawn Amount</span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#00cfe81f] flex justify-center items-center text-xl">
            <BsCurrencyDollar className="text-[#00cfe8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
            <h2 className="text-lg font-bold">$ {pendingAmount}</h2>
            <span className="text-sm font-normal">Pending Amount</span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#7367f01f] flex justify-center items-center text-xl">
            <BsCurrencyDollar className="text-[#7367f0] shadow-lg" />
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
        <div className="bg-[#283046] text-[#d0d2d6] rounded-md p-5">
          <h2 className="text-lg">Send Amount Request</h2>
          <div className="py-5">
            <form onSubmit={sendRequest}>
              <div className="flex gap-3 flex-wrap">
                <input
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                  required
                  type="number"
                  min={0}
                  className="px-3 md:w-[79%] py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  name="amount"
                />
                <button
                  disabled={loader}
                  className="bg-indigo-500 hover:shadow-indigo-500/50 hover:shadow-lg text-white rounded-sm px-4 py-2 text-sm"
                >
                  {loader ? "Loading..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
          <div className="">
            <h2 className="text-lg pb-4">Pending Amount Request</h2>
            <div className="">
              <div className="w-full overflow-x-auto">
                <div className="flex bg-[#161d31] uppercase text-xs min-w-[340px]">
                  <div className="w-[25%] p-2">No.</div>
                  <div className="w-[25%] p-2">Amount</div>
                  <div className="w-[25%] p-2">Status</div>
                  <div className="w-[25%] p-2">Date</div>
                </div>
                {
                  <List
                    style={{ minWidth: "340px", overflowX: "hidden" }}
                    className="List"
                    height={350}
                    itemCount={pendingWithdraws.length}
                    itemSize={35}
                    outerElementType={outerElementType}
                  >
                    {PendingWithdrawRow}
                  </List>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#283046] text-[#d0d2d6] rounded-md p-5">
          <div className="">
            <h2 className="text-lg pb-4">Successfully Withdrawn Amount</h2>
            <div className="">
              <div className="w-full overflow-x-auto">
                <div className="flex bg-[#161d31] uppercase text-xs min-w-[340px]">
                  <div className="w-[25%] p-2">No.</div>
                  <div className="w-[25%] p-2">Amount</div>
                  <div className="w-[25%] p-2">Status</div>
                  <div className="w-[25%] p-2">Date</div>
                </div>
                {
                  <List
                    style={{ minWidth: "340px", overflowX: "hidden" }}
                    className="List"
                    height={350}
                    itemCount={successWithDraws.length}
                    itemSize={35}
                    outerElementType={outerElementType}
                  >
                    {SuccessWithdrawRow}
                  </List>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
