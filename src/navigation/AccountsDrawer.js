//SettingDrawers.js

import React, { useState } from 'react';
import { Modal, TouchableOpacity, StyleSheet, View, Text, TextInput } from "react-native";
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const AccountsDrawer = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => setModalVisible(true)} >
                <MaterialCommunityIcons
                    name="clipboard-account"
                    size={40}
                    color="white"
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
                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <MaterialCommunityIcons
                                name="close-box"
                                size={40}
                                color="white"
                            />
                        </TouchableOpacity>
                        {!formVisible ? (
                            <>
                                <Text style={styles.label}>Login</Text>

                                {/* Username/Email Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Username or Email"
                                    placeholderTextColor="#999"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />

                                {/* Password Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#999"
                                    secureTextEntry={true}
                                />
                                {/* Login Button */}
                                < TouchableOpacity style={styles.loginButton}>
                                    <Text style={styles.loginButtonText}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.signupLinkButton} onPress={() => setFormVisible(!formVisible)}>
                                    <Text style={styles.signupLinkButtonText}>Sign Up</Text>
                                </TouchableOpacity>
                            </>
                        ) : ("")}
                    </View>

                </View>
            </Modal >
        </View >
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'

    },
    modalContainer: {
        width: '90%',
        height: '50%',
        backgroundColor: '#014955',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 20,
        fontSize: 18,
    },
    gearIcon: {
        marginRight: 10
    },
    label: {
        fontSize: 25,
        color: 'white',
        textTransform: 'uppercase',
        width: '100%',
        textAlign: 'center',
        marginBottom: 30
    },
    input: {
        width: '80%',
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        fontSize: 16,
    },
    loginButton: {
        width: '80%',
        padding: 15,
        marginTop: 20,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupLinkButton: {
        width: '80%',
        marginTop: 20,
        alignItems: 'flex-end'
    },
    signupLinkButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10,
    }
});


export default AccountsDrawer;