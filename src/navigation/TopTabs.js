import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';
import Recent from '../screens/Recent';
import Starred from '../screens/Starred';

const Tab = createMaterialTopTabNavigator();

// Custom Tab Bar
function CustomTabBar({ state, descriptors, navigation }) {
    const [showFilter, setShowFilter] = useState(false);
    const [checked, setChecked] = useState('list');

    const handleFilterChange = (value) => {
        setChecked(value);
        setShowFilter(!showFilter);
        // Pass the checked value to the Recent tab using navigation
        const recentRoute = state.routes.find((route) => route.name === 'Recent');
        if (recentRoute) {
            navigation.navigate('Recent', { viewData: value });
        }
    };

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
                    <RadioButton.Group onValueChange={handleFilterChange} value={checked}>
                        <TouchableOpacity
                            style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: '#ccc', borderWidth: 2, padding: 15 }}
                            onPress={() => handleFilterChange('grid')}
                        >
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Grid</Text>
                            <RadioButton value="grid" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: '#ccc', borderBottomWidth: 2, padding: 15 }}
                            onPress={() => handleFilterChange('list')}
                        >
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
        <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} >
            <Tab.Screen name="Recent" component={Recent} />
            <Tab.Screen name="Starred" component={Starred} />
        </Tab.Navigator>
    );
};

export default TopTabs;
