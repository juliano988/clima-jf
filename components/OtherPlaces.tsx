import Constants from 'expo-constants';
import React, { SetStateAction, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


function PlaceInfo(props: { placeName: string, placeInfoCardsState: Array<string[] | React.Dispatch<React.SetStateAction<string[]>>> }): JSX.Element {

    const navigation = useNavigation();

    const [dinamicOpacity,setDinamicOpacity] = useState(1)
    const [placeInfo, setPlaceInfo] = useState<any>();
    const [selectedCards,setSelectedCards] = useState<Array<string>>([])

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
                    setPlaceInfo(null);
                }
            })
    }, [props.placeName]);

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 50,
            width: '100%',
            marginTop: 5,
            marginBottom: 5,
            backgroundColor: 'hsl(0, 0%, 80%)',
            opacity: 1
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

    function handleOnPress(placeInfo: any) {
        navigation.navigate('Home', { placeInfo });
    }

    function handleOnLongPress(){
        if(selectedCards.includes(props.placeName)){
            selectedCards.splice(selectedCards.indexOf(props.placeName),1)
            setDinamicOpacity(1)
        }else{
            selectedCards.push(props.placeName)
            setDinamicOpacity(0.5)
        }
        setSelectedCards(selectedCards)
    }



    if (placeInfo) {
        return (
            <TouchableOpacity style={{opacity: dinamicOpacity}} onPress={() => { handleOnPress(placeInfo) }} onLongPress={handleOnLongPress}>
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
    } else { return <></> }

}

export default function OtherPlaces(): JSX.Element {

    const [inputText, setInputText] = useState<string>('');
    const [placeInfoCards, setplaceInfoCards] = useState<Array<string>>(['São Paulo']);

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

    function handleOnEndEditing() {
        onPressHandler();
    }

    function onPressHandler() {
        fetch('https://api.openweathermap.org/data/2.5/weather?q=' + inputText.trim() + '&lang=pt_br&units=metric&appid=1fb7c4580dd8026407af5aa4a4c5b072')
            .then(function (res) {
                if (res.ok) {
                    placeInfoCards.unshift(inputText.trim())
                    setplaceInfoCards(placeInfoCards)
                    setInputText('');
                } else {
                    setInputText('');
                    alert('Deu ruim');
                }
            })
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
                {placeInfoCards.map(function (placeName, index) { return <PlaceInfo placeName={placeName} key={index} placeInfoCardsState={[placeInfoCards,setplaceInfoCards]} /> })}
            </ScrollView>
        </View>
    )
}