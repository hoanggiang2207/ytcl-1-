import React, { useState } from 'react';
import Avatar from 'react-avatar';


const Comment = ({ onSubmit }) => {
    const [input, setInput] = useState("");

    const handleSubmit = () => {
        onSubmit(input);
        setInput("");
    };

    return (
        <div className='flex items-center justify-between  mt-5 w-[995px]'>
            <div className='flex items-center gap-3 w-[100%]'>
                <div>
                    <Avatar src={"https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?cs=srgb&dl=pexels-andrewpersonaltraining-697509.jpg&fm=jpg"} size={40} round={true} />
                </div>
                <input value={input} onChange={(e) => setInput(e.target.value)} className='border-b w-[100%] border-gray-300 outline-none ml-2' type="text" placeholder='Add a comment...' />
                
            </div>
        </div>
    );
}

export default Comment;