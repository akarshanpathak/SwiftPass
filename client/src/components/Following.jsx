import React, { useEffect, useState } from 'react';
import { getUser } from '../utils/auth';
import { getFollowing } from '../services/user.services';
import toast from "react-hot-toast";
import { FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const avatarColors = [
  'bg-green-100 text-green-700',
  'bg-teal-100 text-teal-700',
  'bg-blue-100 text-blue-700',
  'bg-pink-100 text-pink-700',
];

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function Avatar({ src, name, colorClass }) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${colorClass}`}>
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setImgError(true)}
      className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-green-100"
    />
  );
}



function Following() {
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getUser();
    const fetchFollowing = async () => {
      try {
        const response = await getFollowing();
        setFollowing(response.data.following.following);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    };
    if (currentUser) fetchFollowing();
  }, []);

  const handleMessage = (userId) => {
    // navigate(`/chat/${userId}`);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-10 bg-gradient-to-br from-green-50 via-white to-green-100 min-h-screen w-full">

      <div className="flex items-center gap-3 mb-8">
        <FaUsers className="text-green-500 text-2xl" />
        <h2 className="text-2xl font-bold text-gray-800 font-poppins">Following</h2>
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full ml-1">
          {following.length} people
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {following.map((f, i) => (
          <div
            key={f._id}
            className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-md px-5 py-4 flex items-center gap-4 hover:-translate-y-1 duration-200"
          >
            <Avatar
              src={f.avatar}
              name={f.name}
              colorClass={avatarColors[i % avatarColors.length]}
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate capitalize">{f.name}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{f.email}</p>
            </div>

            <button
              onClick={() => handleMessage(f._id)}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border border-green-200 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white hover:border-green-500 duration-200 flex-shrink-0"
            >
              <MessageCircle size={14} />
              <span>Message</span>
            </button>
          </div>
        ))}
      </div>

      {following.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 text-gray-400 gap-3">
          <FaUsers className="text-5xl text-green-200" />
          <p className="text-sm font-medium">No Following yet</p>
        </div>
      )}

    </div>
  );
}

export default Following
