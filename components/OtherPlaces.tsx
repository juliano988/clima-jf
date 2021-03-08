import Constants from 'expo-constants';
import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Vibration } from 'react-native';


function PlaceInfo(props: { placeName: string, placeInfoCardsState: { placeInfoCards: string[]; setplaceInfoCards: React.Dispatch<React.SetStateAction<string[]>> } }): JSX.Element {

    const navigation = useNavigation();

    const [dinamicContainerDisplay, setdinamicContainerDisplay] = useState<"flex" | "none">('flex')
    const [placeInfo, setPlaceInfo] = useState<any>();
    const [placeInfoAll, setPlaceInfoAll] = useState<any>([]);

    useEffect(function () {
        fetch('https://api.openweathermap.org/data/2.5/weather?q=' + props.placeName + '&lang=pt_br&units=metric&appid=1fb7c4580dd8026407af5aa4a4c5b072')
            .then(function (res) {
                if (res.status === 200) {
                    return res.json();
                }
            }).then(function (data) {
                setPlaceInfoAll(placeInfoAll);
                setPlaceInfo(data);
            })
    }, [props.placeName]);

    const styles = StyleSheet.create({
        container: {
            display: dinamicContainerDisplay,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 50,
            width: '100%',
            marginTop: 5,
            marginBottom: 5,
            backgroundColor: 'hsl(0, 0%, 80%)',
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

    function handleOnPress(placeInfo: any ) {
        const placeInfoCards = props.placeInfoCardsState.placeInfoCards
        navigation.navigate('Mapa', { placeInfo , placeInfoCards});
        navigation.navigate('Home', { placeInfo });
    }

    function handleOnLongPress() {
        props.placeInfoCardsState.placeInfoCards.splice(props.placeInfoCardsState.placeInfoCards.indexOf(props.placeName), 1);
        props.placeInfoCardsState.setplaceInfoCards(props.placeInfoCardsState.placeInfoCards);
        setdinamicContainerDisplay('none');
        const placeInfoCards = props.placeInfoCardsState.placeInfoCards
        navigation.navigate('Mapa', { placeInfo , placeInfoCards});
        navigation.navigate('Locais');
        Vibration.vibrate(1)
    }

    return (
        <TouchableOpacity onPress={() => { handleOnPress(placeInfo) }} onLongPress={handleOnLongPress}>
            <View style={styles.container}>
                <View style={styles.col1}>
                    <Image style={styles.weatherImage} source={{ uri: 'http://openweathermap.org/img/wn/' + placeInfo?.weather[0].icon + '@2x.png' }} />
                    <Text>{placeInfo?.name}</Text>
                </View>
                <View>
                    <Text style={styles.weatherInfo}>{placeInfo?.main.temp ? parseInt(placeInfo?.main.temp) + 'º' : ''}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default function OtherPlaces(): JSX.Element {

    const [inputText, setInputText] = useState<string>('');
    const [refreshing, setRefreshing] = React.useState(false);
    const [placeInfoCards, setplaceInfoCards] = useState<Array<string>>(['São Paulo','Rio de Janeiro']);

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

    function onRefresh(){
        setRefreshing(true);
        setTimeout(function(arg){setplaceInfoCards([]);setplaceInfoCards(arg);setRefreshing(false);},1000,placeInfoCards);
    }

    function handleOnEndEditing() {
        onPressHandler();
    }

    function onPressHandler() {
        if (!placeInfoCards.includes(inputText)) {
            fetch('https://api.openweathermap.org/data/2.5/weather?q=' + inputText.trim() + '&lang=pt_br&units=metric&appid=1fb7c4580dd8026407af5aa4a4c5b072')
                .then(function (res) {
                    if (res.ok) {
                        placeInfoCards.unshift(inputText.trim())
                        setplaceInfoCards(placeInfoCards)
                        setInputText('');
                    } else {
                        setInputText('');
                        alert('Localidade não encontrada');
                    }
                })
        } else {
            alert('Localidade já existente.\nFavor esclher outro local.');
            setInputText('');
        }
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={Constants.statusBarHeight} />}>
            <View style={styles.container}>
                <View style={styles.form}>
                    <TextInput style={styles.textInput} onChangeText={function (text: SetStateAction<string>) { setInputText(text) }} onEndEditing={handleOnEndEditing} value={inputText} placeholder={'Busque pelo nome de uma cidade'}></TextInput>
                    <TouchableOpacity style={styles.formButton} onPress={onPressHandler}>
                        <Text style={styles.formButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.placesView} >
                    {placeInfoCards.map(function (placeName, index) { return <PlaceInfo placeName={placeName} key={index} placeInfoCardsState={{ placeInfoCards: placeInfoCards, setplaceInfoCards: setplaceInfoCards }} /> })}
                </ScrollView>
            </View>
        </ScrollView>
    )
}