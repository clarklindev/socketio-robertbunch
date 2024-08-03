export const chatpanel = () => {
  return (
    <div class="chat-panel col">
      <div class="room-header row col-12">
        
        <div class="col">
          <span class="curr-room-text">Current Room</span>
          <span class="curr-room-num-users">
            Users <span class="fa-solid fa-user"></span>
          </span>
        </div>
        
        <div class="search">
          <span class="glyphicon glyphicon-search"></span>
          <input type="text" id="search-box" placeholder="Search" />
        </div>

      </div>

      <div class="message-form">
        <form id="message-form">
          <div class="col-sm-12">
            <input
              id="user-message"
              type="text"
              placeholder="Enter your message"
            />
          </div>
        </form>
      </div>
      <ul id="messages" class="col-sm-12"></ul>
    </div>
  );
};
