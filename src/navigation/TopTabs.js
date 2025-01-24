// TopTabs.js

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Text, View } from 'react-native';

const Tab = createMaterialTopTabNavigator();


function RecentScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Recent Screen</Text>
        </View>
    )
}

function StarredScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Starred Screen</Text>
        </View>
    )
}

function SortedScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Starred Screen</Text>
        </View>
    )
}

const TopTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Recent" component={RecentScreen} />
            <Tab.Screen name="Starred" component={StarredScreen} />
            <Tab.Screen name="Sorting" component={SortedScreen} />
        </Tab.Navigator>
    );
}

export default TopTabs;