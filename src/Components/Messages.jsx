import React, { useEffect, useState } from 'react'
import Message from './Message'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setEmails } from '../redux/appSlice';

const Messages = () => {

  const {emails, searchText, folder, user} = useSelector(store=>store.appSlice);
  const [tempEmails, settempEmails] = useState(emails)
  const dispatch = useDispatch();

  useEffect(() => {
    const q = query(collection(db, "emails"), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allEmails = snapshot.docs.map((doc)=> ({...doc.data(), id:doc.id}));
      dispatch(setEmails(allEmails));
    })
    
    // cleanup
    return ()=> unsubscribe();
  }, []);

  useEffect(() => {
    const myEmail = user?.email;
    let list = emails || [];
    if (folder === 'sent') {
      list = list.filter((email) => email.from && email.from === myEmail && !email.draft);
    } else if (folder === 'starred') {
      list = list.filter((email) => email.starred && !email.draft);
    } else if (folder === 'drafts') {
      list = list.filter((email) => email.draft && email.from === myEmail);
    } else {
      list = list.filter((email) => !email.draft && (!email.from || email.from !== myEmail));
    }
    const q = (searchText || '').toLowerCase();
    const filteredEmail = list.filter((email) => {
      return (email.subject || '').toLowerCase().includes(q) || (email.to || '').toLowerCase().includes(q) || (email.message || '').toLowerCase().includes(q)
    });
    settempEmails(filteredEmail);
  }, [searchText, emails, folder, user]);
  
  
  const emptyText = folder === 'sent'
    ? 'No sent emails yet'
    : folder === 'starred'
      ? 'No starred emails — click the star on any mail'
      : folder === 'drafts'
        ? 'No drafts — a compose you close with content lands here'
        : 'No emails yet';

  return (
    <div>
      {
        tempEmails && tempEmails.length > 0
          ? tempEmails?.map((email) =>  <Message key={email.id} email={email}/>)
          : <p className='text-center text-gray-400 text-sm py-16'>{emptyText}</p>
      }
    </div>
  )
}

export default Messages
