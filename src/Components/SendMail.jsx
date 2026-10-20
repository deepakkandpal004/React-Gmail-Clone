import React, { useEffect, useRef, useState } from 'react'
import { RxCross2 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { setComposePrefill, setFirst } from '../redux/appSlice';
import { draftEmail } from '../ai';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const SendMail = () => {
    const [formData, setformData] = useState({
        to:"",
        subject:"",
        message:""
    })

    const first = useSelector(store=>store.appSlice.first);
    const composePrefill = useSelector(store=>store.appSlice.composePrefill);
    const user = useSelector(store=>store.appSlice.user);
    const dispatch = useDispatch();

    const [showAiPrompt, setShowAiPrompt] = useState(false);
    const [aiHint, setAiHint] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");
    const [draftId, setDraftId] = useState(null);
    const [toast, setToast] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (composePrefill) {
            setformData({
                to: composePrefill.to || "",
                subject: composePrefill.subject || "",
                message: composePrefill.message || ""
            });
            setDraftId(composePrefill.draftId || null);
            dispatch(setFirst(true));
            dispatch(setComposePrefill(null));
        }
    }, [composePrefill, dispatch]);

    const generateWithAi = async () => {
        if (!aiHint.trim() || aiLoading) return;
        setAiLoading(true);
        setAiError("");
        try {
            const draft = await draftEmail(aiHint.trim());
            setformData(prev => ({
                ...prev,
                subject: draft.subject || prev.subject,
                message: draft.message || prev.message
            }));
            setShowAiPrompt(false);
            setAiHint("");
        } catch (error) {
            setAiError("AI unavailable — is Ollama running?");
        }
        setAiLoading(false);
    }

    const changeHandler = (e) => {
        setformData({...formData,[e.target.name]:e.target.value});
    }

    const sendNow = async (data) => {
        try {
            await addDoc(collection(db, "emails"), {
                from: user?.email || "",
                to: data.to,
                subject: data.subject,
                message: data.message,
                read: false,
                starred: false,
                createdAt: serverTimestamp(),
            });
            if (data.draftId) {
                await deleteDoc(doc(db, "emails", data.draftId));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            if (toast) sendNow(toast);
        }
        const data = { ...formData, draftId };
        setformData({
            to:"",
            subject:"",
            message:""
        });
        setDraftId(null);
        dispatch(setFirst(false));
        setToast(data);
        timerRef.current = setTimeout(() => {
            sendNow(data);
            setToast(null);
        }, 5000);
    }

    const undoSend = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (toast) {
            setformData({
                to: toast.to,
                subject: toast.subject,
                message: toast.message
            });
            setDraftId(toast.draftId || null);
            dispatch(setFirst(true));
            setToast(null);
        }
    }

    const dismissToast = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (toast) {
            sendNow(toast);
            setToast(null);
        }
    }

    const closeCompose = async () => {
        const hasContent = formData.to.trim() || formData.subject.trim() || formData.message.trim();
        try {
            if (draftId && !hasContent) {
                await deleteDoc(doc(db, "emails", draftId));
            } else if (draftId) {
                await updateDoc(doc(db, "emails", draftId), {
                    to: formData.to,
                    subject: formData.subject,
                    message: formData.message,
                    createdAt: serverTimestamp(),
                });
            } else if (hasContent) {
                await addDoc(collection(db, "emails"), {
                    from: user?.email || "",
                    to: formData.to,
                    subject: formData.subject,
                    message: formData.message,
                    read: true,
                    starred: false,
                    draft: true,
                    createdAt: serverTimestamp(),
                });
            }
        } catch (error) {
            console.log(error);
        }
        setformData({
            to:"",
            subject:"",
            message:""
        });
        setDraftId(null);
        dispatch(setFirst(false));
    }
    return (
        <>
        <div className={`${first ? 'block': 'hidden'} bg-white max-width-6xl shadow-xl shadow-slate-600 rounded-t-md`}>
            <div className='flex px-3 py-2 bg-[#F2F6Fc] justify-between rounded-t-md '>
                <h1>New Message</h1>
                <div onClick={closeCompose} className='p-2 rounded-full hover:bg-gray-200 cursor-pointer'>
                    <RxCross2 size={"10px"} />
                </div>
            </div>
            <div className='px-3 pt-2'>
                <button type='button' onClick={() => setShowAiPrompt(prev => !prev)} className='text-sm font-medium text-[#0B57D0] hover:underline'>Write with AI</button>
                {showAiPrompt && (
                    <div className='flex items-center gap-2 mt-2'>
                        <input value={aiHint} onChange={(e) => setAiHint(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); generateWithAi(); } }} type="text" placeholder='Describe the email — e.g. leave application to manager' className='flex-1 outline-none border border-gray-300 rounded-full px-3 py-1.5 text-sm'/>
                        <button type='button' onClick={generateWithAi} disabled={aiLoading} className='bg-[#0B57D0] rounded-full px-3 py-1.5 text-white text-sm font-medium disabled:opacity-50'>{aiLoading ? 'Writing…' : 'Generate'}</button>
                    </div>
                )}
                {aiError && <p className='text-sm text-red-500 mt-1'>{aiError}</p>}
            </div>
            <form onSubmit={submitHandler} className='flex flex-col p-3 gap-2'>
                <input onChange={changeHandler} value={formData.to} name='to' type="text" placeholder='To' className='outline-none py-1'/>
                <input onChange={changeHandler} value={formData.subject} name='subject' type="text" placeholder='Subject' className='outline-none py-1'/>
                <textarea onChange={changeHandler} value={formData.message} name="message" cols={'30'} rows={'10'} className='outline-none py-1'></textarea>
                <button type='submit' className='bg-[#0B57D0] rounded-full w-fit px-4 text-white font-medium'>Send</button>
            </form>
        </div>
        {toast && (
            <div className='fixed bottom-6 left-6 z-50 bg-gray-900 text-white text-sm rounded-md shadow-lg flex items-center gap-4 px-4 py-3'>
                <span>Message sent</span>
                <button onClick={undoSend} className='text-[#8AB4F8] font-medium hover:underline'>Undo</button>
                <button onClick={dismissToast} className='text-gray-400 hover:text-white'>
                    <RxCross2 size={"14px"} />
                </button>
            </div>
        )}
        </>
    )
}

export default SendMail