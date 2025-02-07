"use client"
import { useAppState } from "../provider/SocketProvider";

const BottomBtn = () => {
    const { isChat, setIsChat } = useAppState();

    return (
        <button
            className="z-50 fixed bottom-6 right-6 w-16 h-16 bg-white/80 backdrop-blur-md rounded-full shadow-xl cursor-pointer flex items-center justify-center border-rose-600 border-4 hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
            onClick={() => setIsChat((prev) => !prev)}
            aria-label="Toggle Chat"
        >
            <div className="relative w-full h-full rounded-full overflow-hidden">
                <img
                    src="https://images.pexels.com/photos/5514984/pexels-photo-5514984.jpeg"
                    alt="CHAT"
                    className="w-full h-full object-cover rounded-full"
                />
            </div>
        </button>
    );
};

export default BottomBtn;
