import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import TopRestaurants from "../screens/TopRestaurants";

// Importando stacks
 const Stack = createStackNavigator();
 // Exportando stacks
 export default function TopRestaurantsStack(){
     return(
         <Stack.Navigator>
         <Stack.Screen name="top-restaurans" component={TopRestaurants} options={{title:"Los Mejores Restaurantes"}}/>
         </Stack.Navigator>

     );
 }
