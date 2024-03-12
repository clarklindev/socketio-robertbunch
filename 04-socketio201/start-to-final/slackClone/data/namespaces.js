const Namespace = require('../classes/Namespace');
const Room = require('../classes/Room');

//here we are hardcoding; in production: connect to database to get data
// const wikiNs = {
//     name: '/wiki',
//     image: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png'
// };

// const mozillaNs = {
//     name: '/mozilla',
//     image: 'https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png'
// };

// const linuxNs = {
//     name: '/linux',
//     image: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png'
// };

const wikiNs = new Namespace(
    0,
    'Wikipedia',
    'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png', 
    '/wiki'
);

const mozillaNs = new Namespace(
    1, 
    'Mozilla',
    'https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png',
    '/mozilla'
)

const linuxNs = new Namespace(
    2,
    'Linux',
    'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png',
    '/linux'
)

// 29. rooms and namespaces - ADD ROOMS TO NAMESPACES
wikiNs.addRoom(new Room(0, 'news articles', 0));
wikiNs.addRoom(new Room(1, 'editors', 0));
wikiNs.addRoom(new Room(2, 'other', 0, true));

mozillaNs.addRoom(new Room(0, 'firefox', 1));
mozillaNs.addRoom(new Room(1, 'seaMonkey', 1));
mozillaNs.addRoom(new Room(2, 'spiderMonkey', 1));
mozillaNs.addRoom(new Room(3, 'rust', 1));

linuxNs.addRoom(new Room(0, 'Debian', 2));
linuxNs.addRoom(new Room(1, 'Red hat', 2));
linuxNs.addRoom(new Room(2, 'Ubuntu', 2));
linuxNs.addRoom(new Room(3, 'MacOS', 2));

const namespaces = [wikiNs, mozillaNs, linuxNs];

module.exports = namespaces;