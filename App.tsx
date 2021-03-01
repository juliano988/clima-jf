//https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=1fb7c4580dd8026407af5aa4a4c5b072
//https://api.openweathermap.org/data/2.5/weather?lat=-19.911496000000003&lon=-43.9341985&appid=1fb7c4580dd8026407af5aa4a4c5b072
//https://api.openweathermap.org/data/2.5/weather?lat=-19.911496000000003&lon=-43.9341985&units=metric&lang=pt_br&appid=1fb7c4580dd8026407af5aa4a4c5b072
//https://api.openweathermap.org/data/2.5/forecast?lat=-19.911415&lon=-43.934208&lang=pt_br&units=metric&appid=1fb7c4580dd8026407af5aa4a4c5b072
//https://api.openweathermap.org/data/2.5/weather?q=Rio de Janeiro&appid=1fb7c4580dd8026407af5aa4a4c5b072


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './components/Home'
import OtherPlaces from './components/OtherPlaces'

const Tab = createBottomTabNavigator();

export default function App(): JSX.Element {

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Settings" component={OtherPlaces} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}