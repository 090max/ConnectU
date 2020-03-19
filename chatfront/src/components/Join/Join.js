//userState is a hook
import React, { useState } from "react";
//Link to our /chat path
import { Link } from "react-router-dom";

import "./Join.css";

const Join = () => {
  //Declare hooks like this
  //const [variable , setterFunction]=useState('initial val of the variable')
  const [name, setName] = useState("");

  const [room, setRoom] = useState("");
  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">ConnectU</h1>
        <div>
          <input
            placeholder="Enter your Chat Handle .."
            className="joinInput"
            type="text"
            onChange={event => setName(event.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Enter your Room .."
            className="joinInput mt-20"
            type="text"
            onChange={event => setRoom(event.target.value)}
          />
        </div>

        <Link
          onClick={event => (!name || !room ? event.preventDefault() : null)}
          to={`/chat?name=${name}&room=${room}`}
        >
          <button className="button mt-20" type="submit">
            Chat
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
