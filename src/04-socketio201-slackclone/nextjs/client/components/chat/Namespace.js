'use client';
import Image from "next/image"; 
import classes from './Namespace.module.css';

export function Namespace(props){
  return <div className="namespace" ns={props.endpoint}><Image src={props.image} alt="namespaces" width="100" height="50" className={classes[`namespace-icon`]}/></div>;
}