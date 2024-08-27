'use client';
import Image from "next/image"; 
import { useState, useEffect } from 'react';

import classes from './Namespace.module.css';

const validateImageUrl = async (url) => {
  console.log('url:', url);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/api/validate/validateUrl?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    return data.valid;
  } catch (error) {
    console.error('Error validating image URL:', error);
    return false;
  }
  return false;
};

export function Namespace(props){
  const [isValid, setIsValid] = useState(false);
  const { image } = props;

  useEffect(() => {
    const checkImage = async () => {
      const valid = await validateImageUrl(image);
      setIsValid(valid);
    };
    checkImage();
  }, [image]);

  function clickHandler(event){
    event.preventDefault();
    console.log("endpoint: ", props.endpoint);
    console.log('clicked ns id: ', props.id);
    console.log('rooms: ', props.rooms);
  }

  // Validate image URL
  return <div className="namespace" onClick={clickHandler}>{
    isValid ?
    <Image src={props.image} alt="namespaces" width="100" height="50" className={classes[`namespace-icon`]}/> :
    <div className={classes.placeholder}>placeholder</div>
  }
  </div>;
}