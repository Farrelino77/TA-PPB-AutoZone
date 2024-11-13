// screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.delay(1000)
    ]).start(() => {
      navigation.replace('Login');
    });
  }, []);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?q=80&w=1000&auto=format&fit=crop' }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text style={styles.welcomeText}>Welcome To</Text>
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>Auto</Text>
          <Text style={styles.carText}>Zone</Text>
          <Text style={styles.appText}>App</Text>
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 30,
  },
  welcomeText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 10,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)', 
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  carText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0066CC',
    marginHorizontal: 5,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  appText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  }
});

export default SplashScreen;