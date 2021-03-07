import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';


export default function Map(): JSX.Element {

    const routeParams = useRoute<any>();

    const [mount, setMount] = useState<boolean>(false);
    const [selectedLocation, setSelectedLocation] = useState<any>();

    useEffect(function () {
        if (mount === false) {
            if (routeParams.params === undefined) {
                (async () => {
                    await Location.requestPermissionsAsync();
                    const loc = await Location.getCurrentPositionAsync({});
                    setSelectedLocation([loc.coords.latitude, loc.coords.longitude])
                    setMount(true);
                })();
            } else {
                setSelectedLocation([routeParams.params.placeInfo.coord.lat, routeParams.params.placeInfo.coord.lon]);
                setMount(true);
            }
        }
    }, [mount])

    useEffect(function () {
        if (mount) {
            setSelectedLocation([routeParams.params.placeInfo.coord.lat, routeParams.params.placeInfo.coord.lon])
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
                    }}
                // region = {{
                //     latitude: selectedPlace.coord.lat,
                //     longitude: selectedPlace.coord.lon,
                //     latitudeDelta: 0.0922,
                //     longitudeDelta: 0.0421,
                // }}
                />
            </View>
        )
    } else { return <ActivityIndicator style={{ flex: 1 }} size='large' color='black' /> }

}