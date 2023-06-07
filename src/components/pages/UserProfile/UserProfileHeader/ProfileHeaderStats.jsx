import React from "react";

export default function ProfileHeaderStats({ userData }) {
  return (
    <div className="profile-stats">
      <ul>
        <li>
          <span className="profile-stat-count">{userData.posts.length}</span> post
          {userData.posts.length > 1 && "s"}
        </li>
        <li>
          <span className="profile-stat-count">{userData.followers.length}</span> follower
          {userData.followers.length > 1 && "s"}
        </li>
        <li>
          <span className="profile-stat-count">{userData.following.length}</span> following
        </li>
      </ul>
    </div>
  );
}
