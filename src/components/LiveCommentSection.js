import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Avatar from 'react-avatar'; // Assuming you are using react-avatar
import { BsThreeDotsVertical } from 'react-icons/bs';
import API_KEY from '../constants/yt-API'; // Ensure this contains your API key

const LiveCommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [liveChatId, setLiveChatId] = useState('');

  useEffect(() => {
    const fetchLiveChatId = async () => {
      try {
        const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos`, {
          params: {
            part: 'liveStreamingDetails',
            id: videoId,
            key: API_KEY,
          },
        });
        const liveDetails = res.data.items[0].liveStreamingDetails;
        if (liveDetails && liveDetails.activeLiveChatId) {
          setLiveChatId(liveDetails.activeLiveChatId);
        } else {
          console.error('No active live chat found for this video.');
        }
      } catch (error) {
        console.error('Error fetching live chat ID:', error);
      }
    };

    if (videoId) {
      fetchLiveChatId();
    }
  }, [videoId]);

  useEffect(() => {
    let interval;
    if (liveChatId) {
      const fetchLiveComments = async () => {
        try {
          const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/liveChat/messages`, {
            params: {
              liveChatId,
              part: 'snippet,authorDetails',
              key: API_KEY,
              pageToken: nextPageToken,
            },
          });
          setComments((prevComments) => [
            ...prevComments,
            ...res.data.items.map((item) => ({
              author: item.authorDetails.displayName,
              authorProfileImageUrl: item.authorDetails.profileImageUrl,
              text: item.snippet.displayMessage,
            })),
          ]);
          setNextPageToken(res.data.nextPageToken);
        } catch (error) {
          console.error('Error fetching live comments:', error);
        }
      };

      fetchLiveComments();
      interval = setInterval(fetchLiveComments, 5000); // Fetch new comments every 5 seconds
    }

    return () => clearInterval(interval);
  }, [liveChatId, nextPageToken]);

  return (
    <div className="comment-section mt-4 pb-10 w-[1280px]">
      {comments.map((comment, index) => (
        <div className="comment flex items-center mt-4 gap-1" key={index}>
          <Avatar className="flex-shrink-0" src={comment.authorProfileImageUrl} size={40} round={true} />
          <div className="ml-4 flex-grow">
            <strong className="mr-2">{comment.author}</strong>
            <p className="mt-1">{comment.text}</p>
          </div>
          <BsThreeDotsVertical className='flex-shrink-0 ml-2 cursor-pointer'/>
        </div>
      ))}
    </div>
  );
};

export default LiveCommentSection;