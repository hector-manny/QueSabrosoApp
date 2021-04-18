import React,{useState} from 'react';
import { StyleSheet,View} from 'react-native';
import {Input,Button} from "react-native-elements";
import * as firebase from "firebase";

export default function ChangeDisplayNameForm(props){
    const {displayName,setShowModal,toasRef,setReloadUserInfo}=props;
    const [newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = () =>{
        setError(null);
        if(!newDisplayName){
            setError("El Nombre no puede estar vacio.");
        }else if(displayName === newDisplayName){
            setError("El Nombre no puede ser igual al actual.");
        }else{
            setIsLoading(true);
            const update={
                displayName:newDisplayName
            }
            firebase.auth().currentUser.updateProfile(update).then(()=>{
                setIsLoading(false);
                setReloadUserInfo(true);
                setShowModal(false);

            }).catch(()=>{
                setError("Error Al Actualizar Nombre");
                setIsLoading(false);
            });
        }
    }
    return(
        <View style={styles.view}>
        <Input
            placeholder="Nuevos Nombres y Apellidos"
            containerStyle={styles.input}
            rightIcon={{
                type: "material-community",
                name:"account-circle-outline",
                color:"#c2c2c2"
            }}
            //defaultValue={displayName || ""}
            onChange={ (e) => setNewDisplayName(e.nativeEvent.text)}
            errorMessage={error}
        />
        <Button
            title="Cambiar Datos"
            containerStyle={styles.btnContainer}
            buttonStyle={styles.btn}
            onPress={onSubmit}
            loading={isLoading}
        />
        </View>
    )
}

const styles = StyleSheet.create({
    view:{
        alignItems:"center",
        paddingTop: 10 ,
        paddingBottom: 10,
    },
    input:{
        marginBottom:10,

    },
    btnContainer:{
        marginTop:20,
        width:"95%"
    },
    btn:{
        backgroundColor:"#9acd32"
    }
})