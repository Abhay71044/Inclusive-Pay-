import React, { useState } from 'react';

const UserAvatar = ({ user, className = "w-8 h-8 text-sm" }) => {
  const [imgError, setImgError] = useState(false);

  const photoURL = user?.photoURL;
  const initial = user?.displayName
    ? user.displayName.trim().charAt(0).toUpperCase()
    : user?.email
    ? user.email.trim().charAt(0).toUpperCase()
    : 'U';

  const showImage = photoURL && !imgError && (photoURL.startsWith('http') || photoURL.startsWith('data:'));

  if (showImage) {
    return (
      <img
        src={photoURL}
        alt="User Avatar"
        onError={() => setImgError(true)}
        className={`${className} rounded-full border border-indigo-400 object-cover shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${className} rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-extrabold uppercase shadow-sm border border-indigo-400/40 shrink-0 select-none`}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
