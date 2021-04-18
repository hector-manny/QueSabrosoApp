import React,{useState,useEffect,useCallback,useRef}from 'react';
import { StyleSheet, Text, View,ScrollView,Dimensions} from 'react-native';
import {Rating,ListItem,Icon} from "react-native-elements";
import Loading from "../../components/Loading";
import Carousel from "../../components/Carousel";
import Map from "../../components/Map.js";
import {map} from "lodash";
import ListReviews from "../../components/Restaurants/ListReviews";
import {useFocusEffect} from "@react-navigation/native";
import Toast from "react-native-easy-toast";

import {firebaseApp} from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { diffClamp } from 'react-native-reanimated';

const db = firebase.firestore(firebaseApp);
const screenWidth= Dimensions.get("window").width;

export default function Restaurant(props) {
    const {navigation,route} = props;
    const {id,name} = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();

   
       useEffect(() => {
       //Obteniendo titulo de manera dinamica
       
       props.navigation.setOptions({ title: props.route.params.name  })
     }, [])
     

        firebase.auth().onAuthStateChanged((user) => {
            user ? setUserLogged(true) : setUserLogged(false);
        })
  
    //COmprobando si el usuario esta logged
   

    useFocusEffect(
        useCallback(() => {
            setRestaurant(null);
            db.collection("restaurants").doc(id).get().then((response) =>{
                const data = response.data();
                data.id = response.id;
                setRestaurant(data);
                setRating(data.rating);
            })
        }, [id])
    );
    useEffect(() => {
       if(userLogged && restaurant){
           db.collection("favorites")
           .where("idRestaurant","==",restaurant.id)
           .where("idUser","==",firebase.auth().currentUser.uid)
           .get()
           .then((response)=>{
                if(response.docs.length === 1){
                    setIsFavorite(true);
                }
           })
       }
    }, [userLogged, restaurant])
   
    const addFavorite = () =>{
        if(!userLogged){
            toastRef.current.show("Para usar el sistema de favoritos tienes que estar loggeado");
        } else {
            const payload ={
                idUser: firebase.auth().currentUser.uid,
                idRestaurant:restaurant.id
            }
            db.collection("favorites").add(payload).then(() => {
                setIsFavorite(true);
                toastRef.current.show("Restaurante Añadido a Favorito");
            }).catch (() => {
                toastRef.current.show("Error al añadir a Favoritos")
            })
        }
    }
    const removeFavorite = () => {
        db.collection("favorites")
        .where("idRestaurant","==",restaurant.id)
        .where("idUser","==",firebase.auth().currentUser.uid)
        .get()
        .then((response)=>{
            response.forEach((doc)=> {
                const idFavorite = doc.id;
                db.collection("favorites")
                .doc(idFavorite)
                .delete()
                .then(() => {
                    setIsFavorite(false);
                    toastRef.current.show("Restaurante Eliminado de Favoritos");
                }).catch(()=>{
                    toastRef.current.show("Error al eliminar el restuarante de favoritos")
                })
            })
        })
    }

    if(!restaurant) return <Loading isVisible={true} text="Cargando"/>
    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavorites}>
                <Icon
                     type="material-community"
                     name={isFavorite ? "heart" : "heart-outline"}
                     onPress={isFavorite ? removeFavorite : addFavorite}
                     color={isFavorite ? "#f00" : "#000"}
                     size={35}
                     underlayColor={"transparent"}
                />
            </View>
            <Carousel
            arrayImages={restaurant.images}
            height={250}
            width={screenWidth}
            //
            />
            <TitleRestaurant
             name={restaurant.name}
             description={restaurant.description}
             number={restaurant.number}
             rating={restaurant.rating}
            />
            <RestaurantInfo
            location={restaurant.location}
            name={restaurant.name}
            address={restaurant.address}
            />
            <ListReviews
            navigation={navigation}
            idRestaurant={restaurant.id}
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
    )
}

function TitleRestaurant(props){
    const {name,description,number,rating} = props;
    return(
        <View style={styles.viewRestaurantTitle}>
            <View style={{flexDirection:"row"}}>
            <Text style={styles.nameRestaurant}>{name}</Text>
            <Rating 
                style={styles.rating}
                imageSize={25}
                readonly
                startingValue={parseFloat(rating)}
            />
            </View>
            <Text style={styles.pretitle}>Número: <Text style={styles.numberRestaurant}>{number}</Text></Text>
            <Text style={styles.pretitle}>Descripción: <Text style={styles.descriptionRestaurant}>{description}</Text></Text>
        </View>
    )
}
function RestaurantInfo(props){
    const {location,name,address} = props;
    const listInfo =[{
        text:address,
        iconName:"map-marker",
        iconType:"material-community",
        action:null,
    }]
    return(
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>
            Información sobre el restaurante
            </Text>
            <Map location={location} name={name} height={100} />
            {map(listInfo,(item,index)=>(
                <ListItem
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name:item.iconName,
                        type:item.iconType,
                        color:"#00a680"
                    }}
                    containerStyle={styles.containerListItem}
                />
            ))}
        </View>
    )
}
//PRUEBAA DE ERROR
//  function componentwillUnmount(){
//     this.abortController.abort();
// }
const styles = StyleSheet.create({
        viewBody:{

            flex:1,
            backgroundColor:"#fff"

        },
        viewRestaurantTitle:{
            padding:15,
        },
        nameRestaurant:{
           fontSize:20,
           fontWeight:"bold",
        },
        descriptionRestaurant:{
            color:"grey"
        },
        numberRestaurant:{
            color:"grey",
        },
        rating:{
            position:"absolute",
            right:0,
        },
        pretitle:{
            color:"black",
            marginTop:5
        },
        viewRestaurantInfo:{
            margin:15,
            marginTop:10,
        },
        restaurantInfoTitle:{
            fontSize:20,
            fontWeight:"bold",
            marginBottom:10,
        },
        containerListItem:{
            borderBottomColor:"#d8d8d8",
            borderBottomWidth:1,
        },
        viewFavorites:{
            position:"absolute",
            top:0,
            right:0,
            zIndex:2,
            backgroundColor:"#fff",
            borderBottomLeftRadius: 100,
            padding:5,
            paddingLeft:15
        }


})
