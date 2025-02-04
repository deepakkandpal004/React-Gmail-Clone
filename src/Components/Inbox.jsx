import React, { useState } from "react";
import { BsTag } from "react-icons/bs";
import { GoTriangleDown } from "react-icons/go";
import { HiInbox } from "react-icons/hi";
import {
    MdCheckBoxOutlineBlank,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdOutlineMoreVert,
    MdOutlineRefresh,
    MdPeople,
} from "react-icons/md";
import Messages from "./Messages";

const mailtype = [
    {
        icon: <HiInbox size={"20px"} />,
        text: "Primary",
    },
    {
        icon: <BsTag size={"20px"} />,
        text: "Promotions",
    },
    {
        icon: <MdPeople size={"20px"} />,
        text: "Social",
    },
];

const Inbox = () => {
    const [mailTypeSelected, setmailTypeSelected] = useState(0);

    return (
        <div className="flex-1 bg-white rounded-xl mx-5">
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-gray-700 py-2">
                    <div className="flex items-center gap-1">
                        <MdCheckBoxOutlineBlank size={"20px"} />
                        <GoTriangleDown size={"15px"} />
                    </div>
                    <div className="p-2 rounded-full hover:bg-gray-700 cursor-pointer pl-5">
                        <MdOutlineRefresh size={"20px"} />
                    </div>
                    <div className="p-2 rounded-full hover:bg-gray-700 cursor-pointer">
                        <MdOutlineMoreVert size={"20px"} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500 ">1-50 of 1000</p>
                    <button className="hover:rounded-full hover:bg-gray-100 pl-5"><MdKeyboardArrowLeft className="mr-3" size={"20px"}/></button>
                    <button className="hover:rounded-full hover:bg-gray-100"><MdKeyboardArrowRight size={"20px"}/></button>
                </div>
            </div>
            <div className="h-[90vh] overflow-y-auto ">
                <div className="flex items-center gap-1">
                    {mailtype.map((item, index) => {
                        return (
                            <button
                                className={`flex items-center gap-5 p-4 ${mailTypeSelected === index
                                        ? "border-b-4 border-b-blue-600 text-blue-600"
                                        : "border-b-4 border-b-transparent"
                                    } w-52 hover:bg-gray-100`}
                                onClick={() => {
                                    setmailTypeSelected(index);
                                }}
                                key={index}
                            >
                                {item.icon}
                                <span>{item.text}</span>
                            </button>
                        );
                    })}
                </div>
                <Messages />
            </div>
        </div>
    );
};

export default Inbox;
