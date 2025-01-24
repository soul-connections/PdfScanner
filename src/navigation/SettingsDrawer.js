//SettingDrawers.js

import React, { useState } from 'react';
import { Modal, TouchableOpacity, StyleSheet, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const SettingsDrawer = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => setModalVisible(true)} >
                <AntDesign
                    name="setting"
                    size={24}
                    color="black"
                    style={styles.gearIcon}
                />
            </TouchableOpacity>
            <Modal
                animationType="fade" // The animation effect (slide, fade, etc.)
                transparent={true} // Makes the background behind the modal transparent
                visible={modalVisible} // Controls the visibility of the modal
                onRequestClose={() => setModalVisible(false)} // Android back button handling
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <MaterialCommunityIcons name="close-outline" color="white" size={20} onPress={() => setModalVisible(false)} />
                        {/* <SettingScreen /> */}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background dimming
    },
    modalContainer: {
        width: '70%',
        height: '100%',
        padding: 15,
        backgroundColor: '#014955',
        borderRadius: 5,
        alignItems: 'flex-end',
    },
    modalText: {
        marginBottom: 20,
        fontSize: 18,
    },
    gearIcon: {
        marginRight: 10
    }
});


export default SettingsDrawer;