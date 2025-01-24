// BottomTabs.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Text, View, TouchableOpacity } from 'react-native';
import StackNavigator from "./StackNavigator";
import SettingsDrawer from "./SettingsDrawer";

const Tab = createBottomTabNavigator();

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello Profile</Text>
    </View>
  )
}

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity>
            <FontAwesome name="file-pdf-o" size={24} color="black" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity>
            <View>
              <SettingsDrawer />
            </View>
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Files") {
            iconName = focused ? "folder" : "folder";
          }

          // Return the icon component
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={StackNavigator} options={{ title: '' }} />
      <Tab.Screen name="Files" component={ProfileScreen} options={{ title: '' }} />
    </Tab.Navigator>
  );
};

export default BottomTabs;