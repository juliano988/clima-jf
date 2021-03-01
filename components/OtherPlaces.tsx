import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


function PlaceInfo(props: { placeName: string }): JSX.Element {

    const navigation = useNavigation();

    const [placeInfo, setPlaceInfo] = useState<any>();

    useEffect(function () {
        fetch('https://api.openweathermap.org/data/2.5/weather?q=' + props.placeName + '&lang=pt_br&units=metric&appid=1fb7c4580dd8026407af5aa4a4c5b072')
            .then(function (res) {
                return res.json();
            }).then(function (data) {
                setPlaceInfo(data);
            })
    }, [props.placeName]);

    function handleOnPress(placeInfo:any) {
        navigation.navigate('Home',{placeInfo});
    }

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 50,
            width: '100%',
            marginTop: 5,
            marginBottom: 5,
            backgroundColor: 'hsl(0, 0%, 80%)'
        },
        col1: {
            alignItems: 'center',
            flexDirection: 'row',
        },
        weatherImage: {
            height: 50,
            width: 50
        },
        weatherInfo: {
            paddingRight: 10
        }
    })

    return (
        <TouchableOpacity onPress={() => { handleOnPress(placeInfo) }}>
            <View style={styles.container}>
                <View style={styles.col1}>
                    <Image style={styles.weatherImage} source={{ uri: 'http://openweathermap.org/img/wn/' + placeInfo?.weather[0].icon + '@2x.png' }} />
                    <Text>{placeInfo?.name}</Text>
                </View>
                <View>
                    <Text style={styles.weatherInfo}>{parseInt(placeInfo?.main.temp) + 'º'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default function OtherPlaces(): JSX.Element {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: Constants.statusBarHeight,
            paddingLeft: 10,
            paddingRight: 10
        },
        form: {
            flexDirection: 'row',
            width: '100%'
        },
        textInput: {
            flexBasis: '100%',
            height: 40,
            marginRight: 5,
            borderColor: 'gray',
            borderWidth: 1
        },
        placesView: {
            marginTop: 5
        }
    })

    function onPressHandler() {
        //
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.textInput}></TextInput>
                <Button title="Buscar" onPress={() => { onPressHandler }}></Button>
            </View>
            <ScrollView contentContainerStyle={styles.placesView}>
                <PlaceInfo placeName={'São Paulo'} />
                <PlaceInfo placeName={'Rio de Janeiro'} />
                <PlaceInfo placeName={'Belo Horizonte'} />
                <PlaceInfo placeName={'Porto Alegre'} />
                <PlaceInfo placeName={'Manaus'} />
            </ScrollView>
        </View>
    )
}