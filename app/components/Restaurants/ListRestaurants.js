import React from "react";
import { StyleSheet, Text, View,FlatList,ActivityIndicator,TouchableOpacity } from "react-native";
import {Image} from "react-native-elements";
import {size} from "lodash";
import {useNavigation} from "@react-navigation/native"


export default function ListRestaurants(props) {
    const { restaurants, handleLoadMore, isLoading } = props;
    const navigation = useNavigation();
    
    return (
        <View>
            {size(restaurants) > 0 ? (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) => <Restaurant restaurant={restaurant} navigation={navigation}/>}
                    keyExtractor={(item,index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading} />}
                />
            ) : (
                <View style={styles.loaderRestaurants}>
                <ActivityIndicator size="large" color="#9acd36"/>
                <Text>Cargando Restaurantes</Text>
                </View>
            )}
        </View>
    )
}
function Restaurant(props){
    const {restaurant,navigation} = props;
    const {id,images,name,description,number,address} = restaurant.item;
    const imageRestaurant = images[0];
    const goRestaurant = () => {
        navigation.navigate("restaurant",{
            id,
            name
        });
    }
    return(
        //Touchable nos sirve para que cada elemento sea clickeable
        <TouchableOpacity onPress={goRestaurant}>
         <View style={styles.viewRestaurant}>
            <View style={styles.viewRestaurantImage}>
                <Image
                    resizeMode="cover"
                    PlaceholderContent={<ActivityIndicator color="#fff"/>}
                    source={
                        imageRestaurant ? {uri:imageRestaurant} : require("../../../assets/img/no-image.png")
                    }
                    style={styles.imageRestaurant}
                    
                />
            </View>
            <View>
                    <Text style={styles.retaurantName}>{name}</Text>
                    <Text style={styles.retaurantAddress}>{address}</Text>
                    <Text style={styles.retaurantNumber}>{number}</Text>
                    <Text style={styles.retaurantDescription}>{description.substr(0,30)}...</Text>
            </View>
         </View>
        </TouchableOpacity>
    )
}
function FooterList(props) {
    const { isLoading } = props;
  
    if (isLoading) {
      return (
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator size="large" color="#9acd36" />
        </View>
      );
    } else {
      return (
        <View style={styles.notFoundRestaurants}>
          <Text style={styles.textNotFoundRestaurants}>NO QUEDAN MÁS RESTAURANTES</Text>
        </View>
      );
    }
  }
const styles = StyleSheet.create({

    loaderRestaurants:{
        marginTop:10,
        marginBottom:10,
        alignItems:"center",
    },

    viewRestaurant:{
        flexDirection:"row",
        margin:10,
    },
    viewRestaurantImage:{
        marginRight:15,

    },
    imageRestaurant:{
        width:80,
        height:80,
    },
    retaurantName:{
        fontWeight:"bold"
    },
    retaurantAddress:{
        paddingTop:2,
        color:"grey"
    },
    restaurantDescription:{
        paddingTop:2,
        color:"grey",
        width:300
    },
    retaurantNumber:{
        paddingTop:2,
        fontWeight:"bold",
        color:"grey"
    },
    notFoundRestaurants:{

        marginTop:10,
        marginBottom:20,
        alignItems:"center",
    },
    textNotFoundRestaurants:{
        fontWeight:"bold",
        color:"red",
    }

})
