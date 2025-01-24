import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();

function RecentScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Recent Screen</Text>
            <View style={{ position: 'absolute', bottom: 20, right:10, backgroundColor: '#014955', borderWidth:2, borderRadius:50, width:73, padding:10, alignItems: 'center', justifyContent:'center' }} onPress={{}}>
                <Ionicons name="camera-outline" size={50} color="white"/>
            </View>
        </View>
    );
}

function StarredScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Starred Screen</Text>
        </View>
    );
}

// Custom Tab Bar
function CustomTabBar({ state, descriptors, navigation }) {
    const [showFilter, setShowFilter] = useState(false);
    const [checked, setChecked] = useState('grid');
    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                {/* Render the first two tabs */}
                <View style={{ flexDirection: 'row' }}>
                    {state.routes.slice(0, 2).map((route, index) => {
                        const { options } = descriptors[route.key];
                        const label = options.tabBarLabel ?? options.title ?? route.name;

                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                            });

                            if (!event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={onPress}
                                style={{
                                    padding: 10,
                                    borderBottomWidth: isFocused ? 2 : 0,
                                    borderBottomColor: isFocused ? '#014955' : 'transparent',
                                }}
                            >
                                <Text style={{ color: isFocused ? 'black' : 'grey' }}>{label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Render the Sorted tab separately */}
                <TouchableOpacity
                    onPress={() => setShowFilter(!showFilter)}

                >
                    <Ionicons name="filter-circle-outline" size={24} color="black" style={{ marginRight: 15 }} />
                </TouchableOpacity>
            </View>
            {showFilter ? (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <RadioButton.Group onValueChange={(value) => setChecked(value)} value={checked}>
                        <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: '#ccc', borderWidth: 2, padding: 15 }} onPress={() => setChecked('grid')}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Grid</Text>
                            <RadioButton value="grid" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: '#ccc', borderBottomWidth: 2, padding: 15 }} onPress={() => setChecked('list')}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>List</Text>
                            <RadioButton value="list" />
                        </TouchableOpacity>
                    </RadioButton.Group>
                </View>
            ) : ("")}

        </>
    );
}

const TopTabs = () => {
    return (
        <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
            <Tab.Screen name="Recent" component={RecentScreen} />
            <Tab.Screen name="Starred" component={StarredScreen} />
        </Tab.Navigator>
    );
};

export default TopTabs;
