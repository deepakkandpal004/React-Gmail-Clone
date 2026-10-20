import React from "react";
import { LuStickyNote } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { IoMdTime } from "react-icons/io";
import { BiSend } from "react-icons/bi";
import { HiInbox } from "react-icons/hi";
import { MdExpandMore } from "react-icons/md";
import { RiPencilLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFirst, setFolder } from "../redux/appSlice";

const SiderbarItems = [
  {
    icon: <HiInbox size={"20px"} />,
    text: "Inbox",
    folder: "inbox",
  },
  {
    icon: <IoMdStarOutline size={"20px"} />,
    text: "Starred",
    folder: "starred",
  },
  {
    icon: <IoMdTime size={"20px"} />,
    text: "Snoozed",
  },
  {
    icon: <BiSend size={"20px"} />,
    text: "Sent",
    folder: "sent",
  },
  {
    icon: <LuStickyNote size={"20px"} />,
    text: "Drafts",
    folder: "drafts",
  },
  {
    icon: <MdExpandMore size={"20px"} />,
    text: "More",
  },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const folder = useSelector(store => store.appSlice.folder);

  const openFolder = (item) => {
    if (!item.folder) return;
    dispatch(setFolder(item.folder));
    navigate("/");
  };
  
  return (
    <div className="w-[15%] ">
      <div className="p-3">
        <button onClick={()=> {
          dispatch(setFirst(true))
        }} className="flex items-center p-4 rounded-2xl gap-2 hover:shadow-md bg-[#C2E7FF] text-sm" >
          <RiPencilLine size={"24px"} />
          <p className="pl-2 pr-2">Compose</p>
        </button>
      </div>
      <div className="text-gray-500">
        {SiderbarItems.map((item, index) => {
          return (
            <div key={index} onClick={() => openFolder(item)} className={`flex items-center gap-4 pl-6 py-1 rounded-r-full cursor-pointer my-2 ${item.folder && folder === item.folder ? "bg-[#D3E3FD] font-medium text-gray-800" : "hover:bg-gray-200"}`}>
              {item.icon}
              <p>{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
