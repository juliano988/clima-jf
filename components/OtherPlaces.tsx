import Constants from 'expo-constants';
import React, { SetStateAction, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, TextInputKeyPressEventData, NativeSyntheticEvent, TextInputEndEditingEventData } from 'react-native';
import { useNavigation } from '@react-navigation/native';


function PlaceInfo(props: { placeName: string }): JSX.Element {

    const navigation = useNavigation();

    const [placeInfo, setPlaceInfo] = useState<any>();

    useEffect(function () {
        fetch('https://api.openweathermap.org/data/2.5/weather?q=' + props.placeName + '&lang=pt_br&units=metric&appid=1fb7c4580dd8026407af5aa4a4c5b072')
            .then(function (res) {
                if (res.status === 200) {
                    return res.json();
                }
            }).then(function (data) {
                if (data) {
                    setPlaceInfo(data);
                } else {
                    setPlaceInfo(null)
                    alert('Deu ruim');
                }
            })
    }, [props.placeName]);

    function handleOnPress(placeInfo: any) {
        navigation.navigate('Home', { placeInfo });
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

    if (placeInfo) {
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
    }else{
        return <></>
    }
}

export default function OtherPlaces(): JSX.Element {

    const [inputText, setInputText] = useState<string>('');
    const [placeInfoCards, setplaceInfoCards] = useState<Array<string>>(['São Paulo','Rio de Janeiro','Belo Horizonte','Porto Alegre','Manaus']);

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
            flexBasis: '90%',
            height: 40,
            marginRight: 5,
            paddingLeft: 5,
            borderColor: 'gray',
            borderWidth: 1
        },
        formButton: {
            flexBasis: '10%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        formButtonText: {
            fontSize: 30,
        },
        placesView: {
            marginTop: 5
        }
    })

    function handleOnEndEditing(){
        onPressHandler();
    }

    function onPressHandler() {
        placeInfoCards.unshift(inputText.trim())
        setplaceInfoCards(placeInfoCards)
        setInputText('');
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.textInput} onChangeText={function (text: SetStateAction<string>) { setInputText(text) }} onEndEditing={handleOnEndEditing} value={inputText} placeholder={'Busque pelo nome de uma cidade'}></TextInput>
                <TouchableOpacity style={styles.formButton} onPress={onPressHandler}>
                    <Text style={styles.formButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.placesView} >
                {placeInfoCards.map(function (placeName, index) { return <PlaceInfo placeName={placeName} key={index} /> })}
            </ScrollView>
        </View>
    )
}