import { StatusBar } from 'expo-status-bar';
import React from "react";
import {Alert} from "react-native";
import Loading from "./Loading";
import Weather from "./Weather";
import * as Location from "expo-location";
import axios from "axios";

const API_KEY = "a3cc2b7b5e18b209229ca0b1c8878fdf";

export default class extends React.Component {
  state = {isLoading: true};

  getWeather = async (latitude, longitude) => {
    const {data : {main: {temp}, weather}} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    this.setState({isLoading:false, temp: temp, condition: weather[0].main});
  }

  getLocation = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
      const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync();
      // Send to API and get weather info
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }

  }
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const {isLoading, temp, condition} = this.state;
    return isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition} />;
  }
}

