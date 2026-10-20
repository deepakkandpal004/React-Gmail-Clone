import { deleteDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { BiArchiveIn } from "react-icons/bi";
import { IoMdMore, IoMdArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdOutlineReport,
    MdOutlineMarkEmailUnread,
    MdOutlineDriveFileMove,
} from "react-icons/md";
import { PiLineVerticalThin } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { summarizeEmail, suggestReplies } from "../ai";
import { setComposePrefill, setFirst } from "../redux/appSlice";

const Mail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedEmail } = useSelector((store) => store.appSlice);
    const params = useParams();

    const [summary, setSummary] = useState("");
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState("");
    const [replies, setReplies] = useState([]);
    const [repliesLoading, setRepliesLoading] = useState(false);
    const [repliesError, setRepliesError] = useState("");

    useEffect(() => {
        setSummary("");
        setSummaryError("");
        setReplies([]);
        setRepliesError("");
    }, [params.id]);

    const handleSummarize = async () => {
        setSummaryLoading(true);
        setSummaryError("");
        try {
            setSummary(await summarizeEmail(selectedEmail));
        } catch (error) {
            setSummaryError("AI unavailable — is Ollama running?");
        }
        setSummaryLoading(false);
    };

    const handleSuggestReplies = async () => {
        setRepliesLoading(true);
        setRepliesError("");
        try {
            setReplies(await suggestReplies(selectedEmail));
        } catch (error) {
            setRepliesError("AI unavailable — is Ollama running?");
        }
        setRepliesLoading(false);
    };

    const handleReplyClick = (reply) => {
        const subject = selectedEmail?.subject || "";
        dispatch(
            setComposePrefill({
                to: selectedEmail?.to || "",
                subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
                message: reply,
            })
        );
        dispatch(setFirst(true));
    };

    const deleteEmailById = async (id) => {
        try {
            await deleteDoc(doc(db, "emails", id));
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 bg-white rounded-xl mx-5"
        >
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-gray-700 py-2">
                    <div
                        onClick={() => {
                            navigate("/");
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 cursor cursor-pointer mr-4"
                    >
                        <IoMdArrowBack size={"20px"} />
                    </div>
                    <div className="p-2 rounded-full hover:bg-gray-100 cursor cursor-pointer">
                        <BiArchiveIn size={"20px"} />
                    </div>
                    <div className="p-2 rounded-full hover:bg-gray-100 cursor cursor-pointer">
                        <MdOutlineReport size={"20px"} />
                    </div>
                    <div
                        onClick={() => {
                            deleteEmailById(params.id);
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 cursor cursor-pointer"
                    >
                        <RiDeleteBin6Line size={"20px"} />
                    </div>
                    <div className="p-2 rounded-full hover:bg-gray-100 cursor cursor-pointer">
                        <PiLineVerticalThin size={"20px"} />
                    </div>
                    <div className="p-2 rounded-full hover:bg-gray-100 cursor cursor-pointer">
                        <MdOutlineMarkEmailUnread size={"20px"} />
                    </div>
                    <div className="p-2 rounded-full hover:bg-gray-100 cursor cursor-pointer">
                        <MdOutlineDriveFileMove size={"20px"} />
                    </div>
                    <div className="p-2 rounded-full hover:bg-gray-100 cursor cursor-pointer">
                        <IoMdMore size={"20px"} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500 ">1-50 of 1000</p>
                    <button className="hover:rounded-full hover:bg-gray-100 pl-5">
                        <MdKeyboardArrowLeft className="mr-3" size={"20px"} />
                    </button>
                    <button className="hover:rounded-full hover:bg-gray-100">
                        <MdKeyboardArrowRight size={"20px"} />
                    </button>
                </div>
            </div>
            <div className="h-[90vh] overflow-y-auto p-4">
                <div className="flex items-center justify-between bg-white gap-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-medium">{selectedEmail?.subject}</h1>
                        <span className="text-sm bg-gray-200 rounded-md px-2">Inbox</span>
                    </div>
                    <div className="flex-none text-gray-400 my-5 text-sm">
                        <p>
                            {new Date(selectedEmail?.createdAt?.seconds * 1000).toUTCString()}
                        </p>
                    </div>
                </div>
                <div className="text-gray-500 text-sm">
                    <h1>{selectedEmail?.to}</h1>
                    <span>to me</span>
                </div>
                <div className="my-10 ">
                    <p>{selectedEmail?.message}</p>
                </div>
                <div className="border-t border-gray-200 pt-4 pb-10">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSummarize}
                            disabled={summaryLoading}
                            className="border border-gray-300 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                            {summaryLoading ? "Summarizing…" : "Summarize"}
                        </button>
                        <button
                            onClick={handleSuggestReplies}
                            disabled={repliesLoading}
                            className="border border-gray-300 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                            {repliesLoading ? "Thinking…" : "Smart replies"}
                        </button>
                    </div>
                    {summaryError && (
                        <p className="text-sm text-red-500 mt-3">{summaryError}</p>
                    )}
                    {summary && (
                        <div className="bg-[#F2F6Fc] rounded-lg p-4 mt-4">
                            <p className="text-xs font-medium text-gray-500 mb-1">AI summary</p>
                            <p className="text-sm text-gray-800">{summary}</p>
                        </div>
                    )}
                    {repliesError && (
                        <p className="text-sm text-red-500 mt-3">{repliesError}</p>
                    )}
                    {replies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {replies.map((reply, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleReplyClick(reply)}
                                    className="border border-gray-300 rounded-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Mail;
