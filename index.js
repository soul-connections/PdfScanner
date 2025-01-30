import React, { useState } from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App'; // Your main app
import SplashScreen from './src/screens/splash/SplashScreen'; // Import the custom SplashScreen
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

enableScreens();

const RootComponent = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Show Splash Screen initially
  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  // Render the main app after loading
  return <App />;
};

AppRegistry.registerComponent(appName, () => RootComponent);
