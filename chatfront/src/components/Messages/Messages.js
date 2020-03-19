import React from "react";

import "./Messages.css";
import Message from "../Message/Message.js";
import ScrollToBottom from "react-scroll-to-bottom";

const Messages = ({ messages, name }) => {
  return (
    <ScrollToBottom className="messages">
      {messages.map((message, i) => {
        return (
          <div key={i}>
            <Message message={message} name={name} />
          </div>
        );
      })}
    </ScrollToBottom>
  );
};

export default Messages;
