//useEffect is simmillar to componentDidMount and comoponnentDidUpdate
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
//Helps retrieveing data from url
import queryString from "query-string";

import io from "socket.io-client";

import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages.js";
import UserInfo from "../UserInfo/UserInfo.js";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");

  const [room, setRoom] = useState("");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [usersinRoom, setUsersinRoom] = useState([]);

  const [client_error, setClientError] = useState("");
  const ENDPOINT = "http://connectu-chat.herokuapp.com/";

  useEffect(() => {
    //The first thing is to retrieve the data

    //queryString will convert the url into an object
    //location.search returns the url parameters
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);
    setUsersinRoom([name]);

    socket.emit("join", { name, room }, error => {
      if (error) setClientError("The user name is already taken in this room");
    });

    //This works as discconeect effect (unmounting)
    return () => {
      socket.emit("disconnect");

      socket.off();
    };
    //The useEfeect will only be called of the ENDPOINt or location.search will change..
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", message => {
      //Inserting the message in the messages array
      setMessages([...messages, message]);
    });

    //Run only when the messages array changes
  }, [messages]);

  useEffect(() => {
    socket.on("getUsers", obj => {
      setUsersinRoom(obj.UserNames);
    });
  }, [usersinRoom]);

  const sendMessage = event => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  if (client_error) {
    alert(client_error);
  }

  return client_error ? (
    <Redirect to="/" />
  ) : (
    <div className="outerContainer">
      <div className="pre_container">
        <UserInfo users={usersinRoom} />
      </div>
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
