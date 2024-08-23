export const Room = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* ROOMS */}
        <div className="rooms">
          
          <div className="main-rooms">
            <h6 className="pointer">
              <i className="room-caret fa-solid fa-caret-down"/>Rooms
            </h6>

            <ul className="room-list">
              {/* GENERATE ROOMS DYNAMICALLY */}
              {/* 
                <li><span className="glyphicon glyphicon-lock"/>Main Room</li>
                <li><span className="glyphicon glyphicon-globe"/>Meeting Room</li> 
              */}
            </ul>
          </div>

          <div className="dm">
            <h6 className="pointer">
              <i className="room-caret fa-solid fa-caret-down"/>Direct Messages
            </h6>

            <ul className="room-list">
              <li>
                <span className="glyphicon glyphicon-lock" />
                Main Room
              </li>
              <li>
                <span className="glyphicon glyphicon-globe" />
                Meeting Room
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
};
