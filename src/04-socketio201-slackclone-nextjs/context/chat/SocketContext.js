"use client";

import { createContext, useReducer, useEffect } from "react";

//prop is the initial context
const initialState = {
  blogPosts: [],
  activeNotification: "",
};

const NotificationContext = createContext({
  showNotification: function (notificationData) {},
  hideNotification: function () {},
  addBlogPost: function (text) {},
  sayHello: function () {},
});

//reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "add_blogpost":
      return {
        ...state,
        blogPosts: [...state.blogPosts, action.payload],
      };
    case "set_active_notification":
      return {
        ...state,
        activeNotification: action.payload,
      };
    default:
      return state;
  }
};

export function NotificationContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (
      state.activeNotification &&
      (state.activeNotification.status === "success" ||
        state.activeNotification.status === "error")
    ) {
      const timer = setTimeout(() => {
        console.log("hide");
        setActiveNotification(null);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [state.activeNotification]);

  //actions
  function addBlogPost(text) {
    dispatch({
      type: "add_blogpost",
      payload: { title: `post #${state.blogPosts.length + 1}`, text },
    });
  }

  function setActiveNotification(notification) {
    dispatch({
      type: "set_active_notification",
      payload: notification,
    });
  }

  function showNotificationHandler(notificationData) {
    setActiveNotification(notificationData);
  }

  function hideNotificationHandler() {
    setActiveNotification(null);
  }

  function sayHello() {
    console.log("Hello");
  }

  //this context has the structure of the initial context...
  const context = {
    notification: state.activeNotification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler,
    addBlogPost,
    sayHello,
  };

  return (
    <NotificationContext.Provider value={context}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
