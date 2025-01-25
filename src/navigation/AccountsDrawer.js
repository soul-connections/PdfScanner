//SettingDrawers.js

import React, { useState } from 'react';
import { Modal, TouchableOpacity, StyleSheet, View, Text, TextInput } from "react-native";
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const AccountsDrawer = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [formValue, setFormValue] = useState('login');

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
                        {formValue === 'login' ? (
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
                                <TouchableOpacity style={styles.forgotButton} onPress={() => setFormValue('forgot')}>
                                    <Text style={styles.forgotButtonText}>Forgot Password?</Text>
                                </TouchableOpacity>
                                {/* Login Button */}
                                < TouchableOpacity style={styles.loginButton}>
                                    <Text style={styles.loginButtonText}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.signupLinkButton} onPress={() => setFormValue('signup')}>
                                    <Text style={styles.signupLinkButtonText}>Create New Account</Text>
                                </TouchableOpacity>
                            </>
                        ) : formValue === 'signup' ? (
                            <>
                                <Text style={styles.label}>Sign Up</Text>

                                {/* Full Name Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    placeholderTextColor="#999"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />

                                {/* Username/Email Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Username or Email"
                                    placeholderTextColor="#999"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />

                                {/* Phone Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone Number"
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
                                    <Text style={styles.loginButtonText}>Sign Up</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.signupLinkButton} onPress={() => setFormValue('login')}>
                                    <Text style={styles.signupLinkButtonText}>Login</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.label}>Forgot Password</Text>



                                {/* Username/Email Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Username or Email or Phone"
                                    placeholderTextColor="#999"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />


                                {/* Forgot Button */}
                                < TouchableOpacity style={styles.loginButton}>
                                    <Text style={styles.loginButtonText}>Send Code</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.signupLinkButton} onPress={() => setFormValue('login')}>
                                    <Text style={styles.signupLinkButtonText}>Back to Login</Text>
                                </TouchableOpacity>
                            </>
                        )}
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
        backgroundColor: 'rgba(0, 0, 0, 0.9)'

    },
    modalContainer: {
        width: '90%',
        paddingTop: 50,
        paddingBottom: 50,
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
        marginTop: 10,
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
        marginTop: 25,
        alignItems: 'flex-end'
    },
    signupLinkButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotButton: {
        width: '80%',
        alignItems: 'flex-end',
        marginTop: 10
    },
    forgotButtonText: {
        color: '#ccc',
        fontSize: 12,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10,
    }
});


export default AccountsDrawer;