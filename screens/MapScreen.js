import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import Colors from '../constants/Colors';

const MapScreen = (props) => {
  const initialLocation = props.navigation.getParam('initialLocation');
  const readonly = props.navigation.getParam('readonly');
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  useEffect(() => {
    // to have access savePickedLocationHandler function outside of this component
    props.navigation.setParams({
      saveLocation: savePickedLocationHandler
    });
  }, [savePickedLocationHandler]);

  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 37.54,
    longitude: initialLocation ? initialLocation.lng : -112.23,
    latitudeDelta: 0.34,
    longitudeDelta: 0.09434
  };

  const selectLocationHandler = (event) => {
    console.log('PICKEED');
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude
    });
  };

  const savePickedLocationHandler = useCallback(() => {
    console.log('saved');
    if (!selectedLocation) {
      Alert.alert(
        'Could not not have picked any location!',
        'Please try again later or pick a location on the map.',
        [{ text: 'Okay' }]
      );
      return;
    }
    props.navigation.navigate('NewPlace', { pickedLocation: selectedLocation });
  }, [selectedLocation]); //this function will re-created when we have new location picked

  let markerCoordinates = null;

  if (selectedLocation) {
    if (readonly) {
      return;
    }
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng
    };
  }

  return (
    <MapView
      style={styles.map}
      region={mapRegion}
      onPress={selectLocationHandler}>
      {markerCoordinates && (
        <Marker title='Picked Location' coordinate={markerCoordinates}></Marker>
      )}
    </MapView>
  );
};

MapScreen.navigationOptions = (navData) => {
  const saveFunct = navData.navigation.getParam('saveLocation');
  const readonly = navData.navigation.getParam('readonly');

  if (readonly) {
    return {};
  }
  return {
    headerRight: () => (
      <TouchableOpacity style={styles.headerButton} onPress={saveFunct}>
        <Text style={styles.headerButtonText}>Save</Text>
      </TouchableOpacity>
    )
  };
};

export default MapScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  headerButtonText: {
    fontSize: 16,
    color: Platform.OS === 'android' ? 'white' : Colors.primary
  },
  headerButton: {
    marginHorizontal: 20
  }
});
