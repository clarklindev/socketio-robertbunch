export const Namespaces = ({children}) => {
  return (
    <div className="namespaces">
      {children}
      {/* below should be populated from from socket server *which gets its data from: slackClone/data/namespaces.js*/}
      {/* <div class="namespace" ns="/wiki"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png"/></div>
      <div class="namespace" ns="/mozilla"><img src="https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png"/></div>
      <div class="namespace" ns="/linux"><img src="https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png"/></div>   */}
    </div> 
  );
}
