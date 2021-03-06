import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Route, ActivityIndicator } from 'react-native';

import * as Location from 'expo-location';
import { ImageSourcePropType } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RefreshControl } from 'react-native';

export default function Home(): JSX.Element {

    const routeParams = useRoute<any>();

    const [mount, setMount] = useState(false);
    const [localWeather, setLocalWeather] = useState<any>();
    const [refreshing, setRefreshing] = React.useState(false);

    function onRefresh() {
        setRefreshing(true);
        fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + localWeather.coord.lat + '&lon=' + localWeather.coord.lon + '&units=metric&lang=pt_br&appid=1fb7c4580dd8026407af5aa4a4c5b072')
            .then(function (res) {
                return res.json();
            }).then(function (data) {
                setLocalWeather(data);
                setRefreshing(false)
            });
    }

    useEffect(function () {
        if (mount === false) {
            (async () => {
                await Location.requestPermissionsAsync();
                const loc = await Location.getCurrentPositionAsync({});
                fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + loc.coords.latitude + '&lon=' + loc.coords.longitude + '&units=metric&lang=pt_br&appid=1fb7c4580dd8026407af5aa4a4c5b072')
                    .then(function (res) {
                        return res.json();
                    }).then(function (data) {
                        setLocalWeather(data);
                        setMount(true);
                    });
            })();
        }
    }, [mount]);

    useEffect(function () {
        setLocalWeather(routeParams.params?.placeInfo);
    }, [routeParams.params?.placeInfo])

    const styles = StyleSheet.create({
        homeContainer: {
            flex: 1,
            backgroundColor: 'hsl(0, 0%, 90%)',
            paddingTop: Constants.statusBarHeight,
            paddingLeft: 10,
            paddingRight: 10
        },
        homeTitle: {
            fontSize: 30,
            paddingTop: 10,
            paddingBottom: 10
        },
        homeOtherInfosTitle: {
            fontSize: 20,
            textAlign: 'center',
            marginTop: 5,
            marginBottom: 5
        },
        homeOtherInfosView: {
            width: '100%',
        }
    });

    if (mount) {
        return (
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={Constants.statusBarHeight} />}>
                <View style={styles.homeContainer}>
                    <Text style={styles.homeTitle}>{localWeather?.name + ',' + localWeather?.sys.country}</Text>
                    <WeatherView localWeather={localWeather} />
                    <Text style={styles.homeOtherInfosTitle}>Outras Inormações</Text>
                    <ScrollView>
                        <View style={styles.homeOtherInfosView}>
                            <OtherInfosItem infoImage={require('../assets/icons/atmospheric_pressure.png')} infoName={'Pressão Atmosférica'} infoValue={localWeather?.main.pressure} mesureUnit={'hPa'} />
                            <OtherInfosItem infoImage={require('../assets/icons/humidity.png')} infoName={'Umidade'} infoValue={localWeather?.main.humidity} mesureUnit={'%'} />
                            <OtherInfosItem infoImage={require('../assets/icons/wind.png')} infoName={'Velocidade do Vento'} infoValue={localWeather?.wind.speed} mesureUnit={'m/s'} />
                            <OtherInfosItem infoImage={require('../assets/icons/cloudiness.png')} infoName={'Nebulosidade'} infoValue={localWeather?.clouds.all} mesureUnit={'%'} />
                            <OtherInfosItem infoImage={require('../assets/icons/sunrise.png')} infoName={'Nascer do Sol'} infoValue={new Date((localWeather?.sys.sunrise + localWeather?.timezone) * 1000).getHours() + new Date().getTimezoneOffset() / 60 + ':' + new Date(localWeather?.sys.sunrise * 1000).getMinutes().toString(10).padStart(2,'0')} mesureUnit={'h:min'} />
                            <OtherInfosItem infoImage={require('../assets/icons/sunset.png')} infoName={'Por do Sol'} infoValue={new Date((localWeather?.sys.sunset + localWeather?.timezone) * 1000).getHours() + new Date().getTimezoneOffset() / 60 + ':' + new Date(localWeather?.sys.sunset * 1000).getMinutes().toString(10).padStart(2,'0')} mesureUnit={'h:min'} />
                        </View>
                    </ScrollView>
                    <StatusBar style="auto" />
                </View>
            </ScrollView>
        );
    } else {
        return <ActivityIndicator style={{ flex: 1 }} size='large' color='black' />
    }
}

function WeatherView(props: { localWeather: any }) {

    const styles = StyleSheet.create({
        homeWeatherView: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
            backgroundColor: 'hsl(0, 0%, 80%)',
        },
        homeWeatherTemp: {
            fontSize: 100
        },
        homeWeatherBar: {
            height: '50%',
            width: 1,
            backgroundColor: 'hsl(0, 0%, 90%)',
            marginLeft: 5,
            marginRight: 5
        },
        homeWeatherMinMax: {
            flexDirection: 'column',
            height: '50%',
            justifyContent: 'space-between'
        },
        homeWeatherMinMaxText: {
            fontSize: 20
        },
        homeWeatherImageView: {
            alignItems: 'center',
            marginTop: -20
        },
        homeWeatherImageViewText: {
            textAlign: 'center',
            marginTop: -20
        },
    })

    return (
        <View style={styles.homeWeatherView}>
            <Text style={styles.homeWeatherTemp}>{parseInt(props.localWeather?.main.temp, 10) + 'º'}</Text>
            <View style={styles.homeWeatherBar}></View>
            <View style={styles.homeWeatherMinMax}>
                <Text style={styles.homeWeatherMinMaxText}>{' ' + parseInt(props.localWeather?.main.temp_max, 10) + 'º'}</Text>
                <Text style={styles.homeWeatherMinMaxText}>{' ' + parseInt(props.localWeather?.main.temp_min, 10) + 'º'}</Text>
            </View>
            <View style={styles.homeWeatherImageView}>
                <Image source={{ uri: 'http://openweathermap.org/img/wn/' + props.localWeather?.weather[0].icon + '@2x.png' }} style={{ width: 100, height: 100 }}></Image>
                <Text style={styles.homeWeatherImageViewText}>{props.localWeather?.weather[0].description.replace(/\s/g, '\n')}</Text>
            </View>
        </View>
    )
}

function OtherInfosItem(props: { infoImage: ImageSourcePropType, infoName: string, infoValue: number | string | null, mesureUnit: string }): JSX.Element {

    const styles = StyleSheet.create({
        OtherInfosViewInfoItem: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 50,
            marginTop: 5,
            marginBottom: 5,
            backgroundColor: 'hsl(0, 0%, 80%)'
        },
        OtherInfosViewInfoItemView1: {
            alignItems: 'center',
            flexDirection: 'row'
        }
    });

    return (
        <View style={styles.OtherInfosViewInfoItem}>
            <View style={styles.OtherInfosViewInfoItemView1}>
                <Image style={{ height: 45, width: 45 }} source={props.infoImage}></Image>
                <Text style={{ fontSize: 15 }}>{' ' + props.infoName}</Text>
            </View>
            <View>
                <Text style={{ paddingRight: 10 }}>{props.infoValue + ' ' + props.mesureUnit}</Text>
            </View>
        </View>
    )
}