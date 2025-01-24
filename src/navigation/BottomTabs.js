// BottomTabs.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: "#014955",
          height: 130
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

          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Files") {
            iconName = focused ? "folder" : "folder";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings-sharp" : "settings-sharp";
          }

          // Return the icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: {
          backgroundColor: "#014955",
          paddingTop: 10
        },
      })}
    >
      <Tab.Screen name="Home" component={StackNavigator} options={{ title: '' }} />
      <Tab.Screen name="Files" component={FilesScreen} options={{ title: '' }} />
      <Tab.Screen name="Settings" component={SettingScreen} options={{ title: '' }} />
    </Tab.Navigator>
  );
};

export default BottomTabs;