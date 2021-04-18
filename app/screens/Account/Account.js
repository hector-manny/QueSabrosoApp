import React, { useState, useEffect} from "react";
import * as firebase from "firebase";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";
import Loading from "../../components/Loading";

export default function Account(){
    const [login, setLogin] = useState(null);
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            //Condicional para saber si el usuario esta logged
        !user ? setLogin(false) : setLogin(true);

        })
    },[])
    // Si no esta logged muestra que esta cargando
    if(login === null) return <Loading isVisible={true} text="Cargando..."/>;

    // Condicional que nos serive para mostrar una screen si el usuario esta logged
    return login ? <UserLogged/> : <UserGuest/>;
}
