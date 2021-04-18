import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Favorites from "../screens/Favorites";

// Importando stacks
 const Stack = createStackNavigator();
 // Exportando stacks
 export default function FavoritesStacks(){
     return(
         <Stack.Navigator>
         <Stack.Screen name="favorites" component={Favorites} options={{title:"Restaurantes Favoritos"}}/>
         </Stack.Navigator>

     );
 }
