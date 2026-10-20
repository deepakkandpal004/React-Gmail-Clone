import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Shared/Navbar'
import Sidebar from './Components/Sidebar'
import Body from './Components/Body'
import Mail from './Components/Mail'
import Inbox from './Components/Inbox'
import SendMail from './Components/SendMail'
import Login from './Components/Login'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { setUser } from './redux/appSlice'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children: [
      {
        path: '/',
        element: <Inbox />
      },
      {
        path: '/mail/:id',
        element: <Mail />
      }
    ]
  }
])

function App() {

  const { user } = useSelector(store => store.appSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setUser({
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        }));
      } else {
        dispatch(setUser(null));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);
  return (
    <div className='bg-[#F5F8FC] h-screen w-screen overflow-hidden'>
      {
        !user ? (
          <Login />
        ) : (
          <>
            <Navbar />
            <RouterProvider router={router} />
            <div className='absolute w-[30%] bottom-0 right-20 z-10'>
              <SendMail />
            </div>
          </>
        )
      }
    </div>
  )
}

export default App
