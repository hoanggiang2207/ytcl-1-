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

  const formatDate = (dateString) => {
    const today = new Date();
    const publishedDate = new Date(dateString);
    const diffTime = Math.abs(today - publishedDate);
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
  
    if (diffSeconds < 1) {
      return "just now";
    } else if (diffSeconds < 60) {
      return `${diffSeconds} ${diffSeconds === 1 ? 'second' : 'seconds'} ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffMonths < 12) {
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    } else {
      return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
    }
  };
  
  

  return (
    <div className="comment-section mt-4 pb-10 w-[1280px]  2xl:w-[935px]">
      {comments.map((comment, index) => (
        <div className="comment flex items-center mt-4 gap-1" key={index}>
          <Avatar className="flex-shrink-0" src={comment.authorProfileImageUrl} size={40} round={true} />
          <div className="ml-4 flex-grow">
            <div className="flex items-center">
              <strong className="mr-2">{comment.author}</strong>
              <span className="text-sm text-gray-500">
                {formatDate(comment.publishedAt)}
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
