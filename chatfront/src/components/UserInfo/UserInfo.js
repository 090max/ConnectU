import React from "react";

import "./UserInfo.css";

const UserInfo = ({ users }) => {
  return (
    <div className="userInfoBar">
      <div className="InnerContainer">
        <ul className="usersList">
          {users.map(user => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserInfo;
