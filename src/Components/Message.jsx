import React from "react";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import { MdCheckBoxOutlineBlank, MdDeleteOutline, MdOutlineMarkEmailRead, MdOutlineMarkEmailUnread } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setComposePrefill, setSelectedEmail } from "../redux/appSlice";
import { motion } from "framer-motion";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function formatDate(seconds) {
    if (!seconds) return "";
    const date = new Date(seconds * 1000);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    return date.toLocaleDateString(
        [],
        date.getFullYear() === now.getFullYear()
            ? { day: "numeric", month: "short" }
            : { day: "numeric", month: "short", year: "numeric" }
    );
}

const Message = ({ email }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const unread = !email?.read;

    const openMail = async () => {
        if (email?.draft) {
            dispatch(
                setComposePrefill({
                    to: email?.to || "",
                    subject: email?.subject || "",
                    message: email?.message || "",
                    draftId: email.id,
                })
            );
            return;
        }
        dispatch(setSelectedEmail(email));
        if (!email?.read) {
            try {
                await updateDoc(doc(db, "emails", email.id), { read: true });
            } catch (error) {
                console.log(error);
            }
        }
        navigate(`/mail/${email.id}`);
    };

    const toggleStar = async (e) => {
        e.stopPropagation();
        try {
            await updateDoc(doc(db, "emails", email.id), {
                starred: !email?.starred,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const toggleRead = async (e) => {
        e.stopPropagation();
        try {
            await updateDoc(doc(db, "emails", email.id), {
                read: !email?.read,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const deleteMail = async (e) => {
        e.stopPropagation();
        try {
            await deleteDoc(doc(db, "emails", email.id));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={openMail}
            className={`group flex items-center justify-between border-b border-gray-200 px-4 py-3 text-sm hover:cursor-pointer hover:shadow-md ${unread ? "bg-white" : "bg-[#F2F6Fc]"}`}
        >
            <div className="flex items-center gap-3">
                <div className="flex-none text-gray-300">
                    <MdCheckBoxOutlineBlank className="w-5 h-5" />
                </div>
                <div onClick={toggleStar} className="flex-none cursor-pointer">
                    {email?.starred ? (
                        <IoMdStar className="w-5 h-5 text-[#F4B400]" />
                    ) : (
                        <IoMdStarOutline className="w-5 h-5 text-gray-300 hover:text-gray-500" />
                    )}
                </div>
                <div className="flex-none w-8 h-8 rounded-full bg-[#0B57D0] text-white flex items-center justify-center font-medium">
                    {(email?.to || "?").charAt(0).toUpperCase()}
                </div>
                <div className="w-40 truncate">
                    <h1 className={unread ? "font-semibold text-gray-900" : "text-gray-600"}>
                        {email?.to}
                    </h1>
                </div>
            </div>
            <div className="flex-1 ml-4 min-w-0">
                <p className="truncate">
                    <span className={unread ? "font-semibold text-gray-900" : "text-gray-700"}>
                        {email?.subject || "(no subject)"}
                    </span>
                    <span className="text-gray-500"> — {email?.message}</span>
                </p>
            </div>
            <div className="flex-none text-gray-500 text-xs ml-4 group-hover:hidden">
                <p className={unread ? "font-semibold text-gray-900" : ""}>
                    {formatDate(email?.createdAt?.seconds)}
                </p>
            </div>
            <div className="flex-none hidden group-hover:flex items-center gap-1 ml-2">
                <div onClick={toggleRead} title={unread ? "Mark as read" : "Mark as unread"} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500">
                    {unread ? <MdOutlineMarkEmailRead className="w-5 h-5" /> : <MdOutlineMarkEmailUnread className="w-5 h-5" />}
                </div>
                <div onClick={deleteMail} title="Delete" className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500">
                    <MdDeleteOutline className="w-5 h-5" />
                </div>
            </div>
        </motion.div>
    );
};

export default Message;
