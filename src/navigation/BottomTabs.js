// BottomTabs.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigationState } from "@react-navigation/native";
import { Text, View, TouchableOpacity } from 'react-native';
import StackNavigator from "./StackNavigator";
import AccountsDrawer from "./AccountsDrawer";

const Tab = createBottomTabNavigator();

function FilesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Files Screen</Text>
    </View>
  )
}

function SettingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Setting Screen</Text>
    </View>
  )
}


const BottomTabs = () => {
  const navigationState = useNavigationState((state) => state);

  // Check if the current screen inside StackNavigator is "Camera"
  let isCameraScreen = false;
  if (navigationState) {
    const homeRoute = navigationState.routes.find((r) => r.name === "Home");
    if (homeRoute && homeRoute.state && homeRoute.state.index !== undefined) {
      const currentScreen = homeRoute.state.routes[homeRoute.state.index].name;
      isCameraScreen = currentScreen === "Camera";
    }
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: !isCameraScreen, // Hide header only when Camera is active
        headerStyle: {
          backgroundColor: "#014955",
          height: 130,
        },
        headerLeft: () => (
          <TouchableOpacity>
            <FontAwesome name="file-pdf-o" size={40} color="white" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity>
            <AccountsDrawer />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Files") iconName = "folder";
          else if (route.name === "Settings") iconName = "settings-sharp";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: isCameraScreen ? { display: "none" } : {
          backgroundColor: "#014955",
          paddingTop: 15,
          height: 100,
        },
      })}
    >
      <Tab.Screen name="Home" component={StackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="Files" component={FilesScreen} options={{ title: 'Files' }} />
      <Tab.Screen name="Settings" component={SettingScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
};

export default BottomTabs;


