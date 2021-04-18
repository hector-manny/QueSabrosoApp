import React,{useEffect} from "react";
import Navigation from "./app/navigations/Navigation";
import {firebaseApp} from "./app/utils/firebase";
//Importando para evitar error entre firebase a la hora de subir el restaurante
import {decode,encode} from "base-64";
if(!global.btoa) global.btoa = encode;
if(! global.atob) global.atob = decode;
import {LogBox} from "react-native";
LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
}, [])
  return <Navigation/>;
}

