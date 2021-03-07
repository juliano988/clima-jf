//https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=1fb7c4580dd8026407af5aa4a4c5b072
//https://api.openweathermap.org/data/2.5/weather?lat=-19.911496000000003&lon=-43.9341985&appid=1fb7c4580dd8026407af5aa4a4c5b072
//https://api.openweathermap.org/data/2.5/weather?lat=-19.911496000000003&lon=-43.9341985&units=metric&lang=pt_br&appid=1fb7c4580dd8026407af5aa4a4c5b072
//https://api.openweathermap.org/data/2.5/forecast?lat=-19.911415&lon=-43.934208&lang=pt_br&units=metric&appid=1fb7c4580dd8026407af5aa4a4c5b072
//https://api.openweathermap.org/data/2.5/weather?q=Rio de Janeiro&appid=1fb7c4580dd8026407af5aa4a4c5b072


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBarOptions, BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from './components/Home'
import OtherPlaces from './components/OtherPlaces'
import Map from './components/Map'

const Tab = createBottomTabNavigator();

export default function App(): JSX.Element {

  const tbNavOption:BottomTabBarOptions | undefined = {
    activeBackgroundColor: 'hsl(0, 0%, 80%)',
    inactiveBackgroundColor: 'hsl(0, 0%, 90%)',
    labelStyle:{
      color: 'black'
    },
  }

  const tbScrOptionHome:BottomTabNavigationOptions = {
    tabBarIcon: function(){return  <Ionicons name="home-sharp" size={30} color="black" />},
  }

  const tbScrOptionLocais:BottomTabNavigationOptions = {
    tabBarIcon: function(){return <Ionicons name="globe-outline" size={30} color="black" />}
  }

  const tbScrOptionMapa:BottomTabNavigationOptions = {
    tabBarIcon: function(){return <Ionicons name="map" size={24} color="black" />}
  }

  return (
    <NavigationContainer>
      <Tab.Navigator tabBarOptions={tbNavOption}>
        <Tab.Screen name="Home" component={Home} options={tbScrOptionHome}/>
        <Tab.Screen name="Locais" component={OtherPlaces} options={tbScrOptionLocais} />
        <Tab.Screen name="Mapa" component={Map} options={tbScrOptionMapa} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}