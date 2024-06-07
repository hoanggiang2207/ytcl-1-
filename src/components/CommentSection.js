import React, { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BASE_URL, API_KEY } from '../constants/yt-API';

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const apiUrl = `${BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const extractedComments = data.items.map(item => ({
          author: item.snippet.topLevelComment.snippet.authorDisplayName,
          authorProfileImageUrl: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
          text: item.snippet.topLevelComment.snippet.textOriginal, // Use textOriginal to get full comment text
          publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
        }));
        
        setComments(extractedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [videoId]);

  return (
    <div className="comment-section mt-4 pb-10 w-[995px]">
      {comments.map((comment, index) => (
        <div className="comment flex items-center mt-4 gap-1" key={index}>
          <Avatar className="flex-shrink-0" src={comment.authorProfileImageUrl} size={40} round={true} />
          <div className="ml-4 flex-grow">
            <div className="flex items-center">
              <strong className="mr-2">{comment.author}</strong>
              <span className="text-sm text-gray-500">
                {new Date(comment.publishedAt).toLocaleTimeString()} ago
              </span>
            </div>
            <p className="mt-1">{comment.text}</p>
          </div>
          <BsThreeDotsVertical className='flex-shrink-0 ml-2 cursor-pointer'/>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
