import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const SplashScreen = ({ onFinish }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onFinish();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [onFinish]);

    return (
        <View style={styles.container}>
            <LottieView
                source={require('./assets/splash.json')}
                autoPlay
                loop
                style={{ width: 500, height: 500 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default SplashScreen;
