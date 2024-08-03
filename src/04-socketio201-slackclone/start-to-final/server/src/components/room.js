export const room = () => {
  return (
    <div class="container-fluid">
      <div class="row">
        {/* ROOMS */}
        <div class="rooms">
          
          <div class="main-rooms">
            <h6 class="pointer">
              <i class="room-caret fa-solid fa-caret-down"/>Rooms
            </h6>

            <ul class="room-list">
              {/* GENERATE ROOMS DYNAMICALLY */}
              {/* 
                <li><span class="glyphicon glyphicon-lock"/>Main Room</li>
                <li><span class="glyphicon glyphicon-globe"/>Meeting Room</li> 
              */}
            </ul>
          </div>

          <div class="dm">
            <h6 class="pointer">
              <i class="room-caret fa-solid fa-caret-down"/>Direct Messages
            </h6>

            <ul class="room-list">
              <li>
                <span class="glyphicon glyphicon-lock" />
                Main Room
              </li>
              <li>
                <span class="glyphicon glyphicon-globe" />
                Meeting Room
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
};
