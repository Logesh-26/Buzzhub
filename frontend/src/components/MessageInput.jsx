import { MdImage } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import { chatstore } from "../store/chatStore";
import { useRef, useState } from "react";
const MessageInput = () => {

    const { sendMessage } = chatstore();
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);

    const fileInputRef = useRef(null);


    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImage(reader.result);
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            await sendMessage({
                text: text.trim(),
                image: image,
            });
            setText("");
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message.", error)
        }
    };

    return (
        <div className="p-1 md:p-2 bg-base-200 fixed bottom-2">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={ () => fileInputRef.current.click() }
                    className="rounded-lg hover:bg-base-300 flex items-center justify-center cursor-pointer"
                    title="Attach image"
                >
                    <MdImage className="size-11 text-primary"/>
                </button>
                <input
                    type="file"
                    accept="image/*"
                    ref={ fileInputRef }
                    className="hidden"
                    onChange={handleImage}
                />
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-1 
                focus:ring-primary transition-colors text-gray-100 bg-slate-700 shadow-sm border border-base-300
                text-sm md:text-base xl:w-[950px] sm:w-[520px]"
                    value={ text }
                    onChange={(e)=> setText(e.target.value)}
                />
                <button
                    onClick={ handleSendMessage }
                    className="p-2 md:p-3 bg-primary hover:bg-primary-focus text-white rounded-lg md:rounded-xl  flex items-center justify-center shadow-xl
                    bg-slate-700 cursor-pointer "
                >
                    <LuSendHorizontal />
                </button>
            </div>
           
        </div>
    )
}

export default MessageInput;