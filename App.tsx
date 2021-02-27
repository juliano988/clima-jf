//https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=1fb7c4580dd8026407af5aa4a4c5b072
//https://api.openweathermap.org/data/2.5/weather?lat=-19.911496000000003&lon=-43.9341985&appid=1fb7c4580dd8026407af5aa4a4c5b072
//https://api.openweathermap.org/data/2.5/weather?lat=-19.911496000000003&lon=-43.9341985&units=metric&lang=pt_br&appid=1fb7c4580dd8026407af5aa4a4c5b072

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Location from 'expo-location';

export default function App(): JSX.Element {

  interface locationCoords {
    accuracy: number | null;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    latitude: number | null;
    longitude: number | null;
    speed: number | null;
  }

  const [mount, setMount] = useState(false);
  const [location, setLocation] = useState<locationCoords>();
  const [localWeather,setLocalWeather] = useState<any>();

  useEffect(function () {
    if (mount === false) {
      setMount(true);
      (async () => {
        await Location.requestPermissionsAsync();
        const loc = await Location.getCurrentPositionAsync({});
        console.log(loc)
        setLocation(loc.coords)
        fetch('https://api.openweathermap.org/data/2.5/weather?lat='+loc.coords.latitude+'&lon='+loc.coords.longitude+'&units=metric&lang=pt_br&appid=1fb7c4580dd8026407af5aa4a4c5b072')
        .then(function(res){
          return res.json();
        }).then(function(data){
          console.log(data)
          setLocalWeather(data);
        })
      })();
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Text>{location?.latitude}</Text>
      <Text>{location?.longitude}</Text>
      <Text>{localWeather?.name}</Text>
      <Image source={{uri: 'http://openweathermap.org/img/wn/'+localWeather?.weather[0].icon+'@2x.png'}} style={{width: 100, height: 100}}></Image>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
