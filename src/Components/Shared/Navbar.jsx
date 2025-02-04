import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { GoQuestion } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { PiDotsNineBold } from "react-icons/pi";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setSearchText } from "../../redux/appSlice";
import { auth } from "../../firebase";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "firebase/auth";

const Navbar = () => {

    const [searchState, setsearchState] = useState("");
    const [toggle, setToggle] = useState(false);
    const { user } = useSelector(store => store.appSlice);

    const dispatch = useDispatch();

    const signOutHandler = () => {
        signOut(auth).then(() => {
            dispatch(setUser(null));
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        dispatch(setSearchText(searchState))
    }, [searchState])

    return (
        <div className="flex items-center justify-between h-16 mx-3">
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-2">
                    <div className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
                        <RxHamburgerMenu size={"20px"} />
                    </div>
                    <img
                        className="w-8"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgChbXjOJlq26KR4Igbind_g9K0cyaVmhuFHBKJzhXyhMTQBuoU9d54eQ&s"
                        alt="Gmail Logo"
                    />
                    <h1 className="text-xl text-gray-500 font-medium">Gmail</h1>
                </div>
            </div>
            <div className="md:block hidden w-[50%] mr-60">
                <div className="flex items-center bg-[#EAF1FB] px-2 py-3 rounded-full">
                    <IoIosSearch size={"24px"} className="text-gray-700" />
                    <input
                        type="text"
                        value={searchState}
                        onChange={(e) => {
                            setsearchState(e.target.value)
                        }}
                        placeholder="Search Mail"
                        className="rounded-full w-full bg-transparent outline-none px-1"
                    />
                </div>
            </div>
            <div className="md:block hidden">
                <div className="flex items-center gap-2">
                    <div className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
                        <GoQuestion size={"20px"} />
                    </div>
                    <div className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
                        <IoSettingsOutline size={"20px"} />
                    </div>
                    <div className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
                        <PiDotsNineBold size={"20px"} />
                    </div>
                    <div className='relative cursor-pointer'>
                        <Avatar onClick={() => setToggle(!toggle)} src={user?.photoURL} googleId="118096717852922241760" size="40" round={true} />
                        <AnimatePresence>
                            {
                                toggle && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.1 }}
                                        className='absolute right-2 z-20 shadow-lg bg-white rounded-md'>
                                        <p onClick={signOutHandler} className='px-6 py-4 font-medium text-xs cursor-pointer'>Logout</p>
                                    </motion.div>
                                )
                            }
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Navbar;
