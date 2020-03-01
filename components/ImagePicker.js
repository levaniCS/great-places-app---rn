import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';
import Colors from '../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const ImgPicker = (props) => {
  const [pickedImage, setPickedImage] = useState();

  const verifyPermissions = async () => {
    // this function we need to work camera permissions properly on IOS apps too.
    //on android it works without this fun
    const result = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant camera permissions to use this app.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const chooseOrTakeImage = async (text) => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    const mode =
      text === 'take'
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;

    const image = await mode({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5
    });
    setPickedImage(image.uri);
    props.onImageTaken(image.uri);
  };

  return (
    <View style={styles.imagePicker}>
      <TouchableOpacity
        style={styles.imagePreview}
        onPress={() => chooseOrTakeImage('take')}>
        {!pickedImage ? (
          <Text>No image picked yet.</Text>
        ) : (
          <Image style={styles.image} source={{ uri: pickedImage }} />
        )}
      </TouchableOpacity>
      <View style={styles.imageBtn}>
        <Button
          title='Take Image'
          color={Colors.primary}
          onPress={() => chooseOrTakeImage('take')}
          style={styles.imageBtn}
        />
      </View>
      <View style={styles.imageBtn}>
        <Button
          title='Choose from Gallery'
          color={Colors.secondary}
          onPress={() => chooseOrTakeImage('choose')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20
  },
  imageBtn: {
    flex: 1,
    marginTop: 20
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1
  },
  image: {
    width: '100%',
    height: '100%'
  }
});

export default ImgPicker;
