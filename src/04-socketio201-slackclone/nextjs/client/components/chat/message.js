/*
messageObj structure:

{
  newMessage,
  date,
  userName,
  avatar
}

*/

export const Message = (messageObj) => {
  return (
    <li>
      <div className="user-image">
        <img src={`${messageObj.avatar}`} />
      </div>

      <div className="user-message">
        <div className="user-name-time">
          {messageObj.userName}{" "}
          <span>{new Date(messageObj.date).toLocaleString()}</span>
        </div>
        <div className="message-text">{messageObj.newMessage}</div>
      </div>
    </li>
  );
};
