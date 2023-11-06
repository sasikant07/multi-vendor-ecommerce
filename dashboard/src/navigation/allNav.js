import { AiFillDashboard, AiOutlineShoppingCart } from "react-icons/ai";
import { BiCategory, BiLoaderCircle } from "react-icons/bi";
import { FiUsers, FiUser } from "react-icons/fi";
import { BsCurrencyDollar } from "react-icons/bs";
import { CiChat1 } from "react-icons/ci";

export const allNav = [
  {
    id: 1,
    title: "Dashboard",
    icon: <AiFillDashboard />,
    role: "admin",
    path: "/admin/dashboard",
  },
  {
    id: 2,
    title: "Orders",
    icon: <AiOutlineShoppingCart />,
    role: "admin",
    path: "/admin/dashboard/orders",
  },
  {
    id: 3,
    title: "Category",
    icon: <BiCategory />,
    role: "admin",
    path: "/admin/dashboard/category",
  },
  {
    id: 4,
    title: "Sellers",
    icon: <FiUsers />,
    role: "admin",
    path: "/admin/dashboard/sellers",
  },
  {
    id: 5,
    title: "Payment Request",
    icon: <BsCurrencyDollar />,
    role: "admin",
    path: "/admin/dashboard/payment-request",
  },
  {
    id: 6,
    title: "Deactivate Seller",
    icon: <FiUser />,
    role: "admin",
    path: "/admin/dashboard/deactivate-sellers",
  },
  {
    id: 7,
    title: "Sellers Request",
    icon: <BiLoaderCircle />,
    role: "admin",
    path: "/admin/dashboard/sellers-request",
  },
  {
    id: 8,
    title: "Chat Sellers",
    icon: <CiChat1 />,
    role: "admin",
    path: "/admin/dashboard/chat-sellers",
  },
  {
    id: 9,
    title: "Dashboard",
    icon: <AiFillDashboard />,
    role: "seller",
    path: "/seller/dashboard",
  },
  {
    id: 10,
    title: "Add Product",
    icon: <AiFillDashboard />,
    role: "seller",
    path: "/seller/add-product",
  },
  {
    id: 11,
    title: "All Product",
    icon: <AiOutlineShoppingCart />,
    role: "seller",
    path: "/seller/dashboard/all-product",
  },
  {
    id: 12,
    title: "Discoutn Product",
    icon: <BiCategory />,
    role: "seller",
    path: "/seller/dashboard/discount-product",
  },
  {
    id: 13,
    title: "Orders",
    icon: <FiUsers />,
    role: "seller",
    path: "/seller/dashboard/orders",
  },
  {
    id: 14,
    title: "Payments",
    icon: <BsCurrencyDollar />,
    role: "seller",
    path: "/seller/dashboard/payment-request",
  },
  {
    id: 15,
    title: "Chat Customer",
    icon: <BiLoaderCircle />,
    role: "seller",
    path: "/seller/dashboard/chat-customer",
  },
  {
    id: 16,
    title: "Chat Support",
    icon: <CiChat1 />,
    role: "seller",
    path: "/seller/dashboard/chat-support",
  },
  {
    id: 17,
    title: "Profile",
    icon: <CiChat1 />,
    role: "seller",
    path: "/seller/dashboard/profile",
  },
];
