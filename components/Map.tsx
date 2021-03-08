import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, Text, Image } from 'react-native';
import * as Location from 'expo-location';
import MapView, { AnimatedRegion, LatLng, Marker } from 'react-native-maps';


export default function Map(): JSX.Element {

    const routeParams = useRoute<any>();

    const [mount, setMount] = useState<boolean>(false);
    const [selectedLocation, setSelectedLocation] = useState<any>();
    const [placesInfo, setPlacesInfo] = useState<any>([]);

    useEffect(function () {
        if (mount === false) {
            if (routeParams.params === undefined) {
                (async () => {
                    await Location.requestPermissionsAsync();
                    const loc = await Location.getCurrentPositionAsync({});
                    setSelectedLocation([loc.coords.latitude, loc.coords.longitude]);
                    await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + loc.coords.latitude + '&lon=' + loc.coords.longitude + '&units=metric&lang=pt_br&appid=1fb7c4580dd8026407af5aa4a4c5b072')
                        .then(function (res) {
                            return res.json();
                        }).then(function (data) {
                            placesInfo.push(data)
                            setPlacesInfo(placesInfo)
                        });
                    setMount(true);
                })();
            } else {
                setSelectedLocation([routeParams.params.placeInfo.coord.lat, routeParams.params.placeInfo.coord.lon]);
                routeParams.params.placeInfoCards.forEach((element: string) => {
                    (async () => {
                        await fetch('https://api.openweathermap.org/data/2.5/weather?q=' + element + '&lang=pt_br&units=metric&appid=1fb7c4580dd8026407af5aa4a4c5b072')
                            .then(function (res) {
                                return res.json()
                            }).then(function (data) {
                                placesInfo.push(data)
                                setPlacesInfo(placesInfo)
                            });
                        setMount(true);
                    })();
                });
            }
        }
    }, [mount]);

    useEffect(function () {
        if (mount) {
            console.log(routeParams.params.placeInfoCards)
            setPlacesInfo([])
            routeParams.params.placeInfoCards.forEach((element: string) => {
                (async () => {
                    await fetch('https://api.openweathermap.org/data/2.5/weather?q=' + element + '&lang=pt_br&units=metric&appid=1fb7c4580dd8026407af5aa4a4c5b072')
                        .then(function (res) {
                            return res.json()
                        }).then(function (data) {
                            placesInfo.push(data)
                            setPlacesInfo(placesInfo)
                        });
                    setSelectedLocation([routeParams.params.placeInfo.coord.lat, routeParams.params.placeInfo.coord.lon]);
                })();
            });
        }
    }, [routeParams.params]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
        map: {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        },
        markMainView: {
            alignItems: 'center',
            backgroundColor: 'hsl(0, 0%, 80%)',
            fontSize: 20,
            height: 75,
            width: 125,
            padding: 5,
            borderRadius: 5
        },
        placeNameLabel:{
            fontWeight: 'bold'
        },
        markView:{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        markImg: {
            height: 50,
            width: 50,
        },
        markTempLabel:{
            fontSize: 20
        }
    });

    if (mount) {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    region={{
                        latitude: selectedLocation[0],
                        longitude: selectedLocation[1],
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                    {placesInfo.map(function (marker: any, index: any) {
                        return <Marker key={index} coordinate={{ latitude: marker.coord.lat, longitude: marker.coord.lon }} >
                            <View style={styles.markMainView}>
                                <Text style={styles.placeNameLabel}>{marker.name}</Text>
                                <View style={styles.markView}>
                                    <Image style={styles.markImg} source={{ uri: 'http://openweathermap.org/img/wn/' + marker?.weather[0].icon + '@2x.png' }} />
                                    <Text style={styles.markTempLabel}>{parseInt(marker.main.temp,10) + 'º'}</Text>
                                </View>
                            </View>
                        </Marker>
                    })}
                </MapView>
            </View>
        )
    } else { return <ActivityIndicator style={{ flex: 1 }} size='large' color='black' /> }

}