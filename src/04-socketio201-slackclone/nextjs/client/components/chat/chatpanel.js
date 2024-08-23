export const Chatpanel = () => {
  return (
    <div className="chat-panel col">
      <div className="room-header row col-12">
        <div className="col">
          <span className="curr-room-text">Current Room</span>
          <span className="curr-room-num-users">
            Users <span className="fa-solid fa-user"></span>
          </span>
        </div>

        <div className="search">
          <span className="glyphicon glyphicon-search"></span>
          <input type="text" id="search-box" placeholder="Search" />
        </div>
      </div>

      <div className="message-form">
        <form id="message-form">
          <div className="col-sm-12">
            <input
              id="user-message"
              type="text"
              placeholder="Enter your message"
            />
          </div>
        </form>
      </div>
      <ul id="messages" className="col-sm-12"></ul>
    </div>
  );
};
