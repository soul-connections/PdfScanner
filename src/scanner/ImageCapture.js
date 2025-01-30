import React from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList, Alert, TextInput } from "react-native";
import { launchCamera } from "react-native-image-picker";
import realm from "../db/realmSchema";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DocumentScanner from "react-native-document-scanner-plugin";
import Dialog from "react-native-dialog"

const ImageCapture = ({ route, navigation }) => {
    const [imageUris, setImageUris] = React.useState([]);
    const [rename, setRename] = React.useState(`Doc_${new Date().toISOString()}`);
    const [renameModal, setRenameModal] = React.useState(false);

    // const lastItem = ''

    // function fetchLastItemName() {

    //     lastItem = imageUris.slice(-1)[0];
    //     if (lastItem !== undefined) {
    //         lastItem = lastItem.fileName
    //     } else {
    //         lastItem = ''
    //     }

    // }

    const openCamera = () => {
        launchCamera(
            {
                mediaType: "photo",
                cameraType: "back",
                saveToPhotos: true,
            },
            (response) => {
                if (response.didCancel) {
                    console.log("User cancelled camera operation.");
                } else if (response.errorCode) {
                    console.log("Camera error: ", response.errorMessage);
                } else if (response.assets && response.assets.length > 0) {
                    // Append full asset objects instead of just `uri`
                    setImageUris((prevUris) => [...prevUris, ...response.assets]);
                    console.log("Captured Image Assets: ", response.assets);
                } else {
                    console.warn("No valid image assets found.");
                }
            }
        );
    };

    const scanDocument = async () => {
        try {
            const { scannedImages } = await DocumentScanner.scanDocument({
                quality: 1, // Quality of the output image (0-1)
                returnBase64: false, // Set to true if you want the image as a Base64 string
                saveToPhotos: true
            });

            if (scannedImages) {
                // Append scanned image URIs to the imageUris state
                setImageUris((prevUris) => [...prevUris, ...scannedImages]);
            }
        } catch (error) {
            console.log("Document scan failed: ", error);
        }
    };

    React.useEffect(() => {
        scanDocument();
        // openCamera();
    }, []);

    const saveFiles = async () => {
        // Show options (checkbox dialog)
        const options = ["Save as JPG", "Save as PDF"];
        Alert.alert(
            "Save Options",
            "Choose file formats to save",
            options.map((option, index) => ({
                text: option,
                onPress: () => handleSaveOption(index),
            }))
        );
    };

    const handleSaveOption = async () => {
        if (imageUris.length === 0) {
            Alert.alert("Error", "No images available to save.");
            return;
        }

        const now = new Date();
        const createdAt = now.toISOString();
        const createdDate = now.toLocaleDateString();
        const createdTime = now.toLocaleTimeString();

        imageUris.forEach((uri, idx) => {
            realm.write(() => {
                realm.create("Document", {
                    id: parseInt(`${new Date().getTime()}`),
                    name: `${rename}.jpg`,
                    filePath: uri,
                    createdAt,
                    createdDate,
                    createdTime,
                    updatedAt: createdAt,
                    updatedDate: createdDate,
                    updatedTime: createdTime,
                    lastOpened: "",
                    deleted: 0,
                    starred: false,
                });
            });
        });
        setImageUris([]); 
        navigation.navigate('HomeScreen')
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Entypo name="home" size={25} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.rename} onPress={() => setRenameModal(true)}>
                    <Text style={styles.renameText}>{rename}</Text>
                    <MaterialIcons name="edit" size={15} color='white' />
                </TouchableOpacity>
                <TouchableOpacity onPress={saveFiles}>
                    <FontAwesome name="save" size={25} color="white" />
                </TouchableOpacity>
            </View>
            {imageUris.length > 0 && (
                <View style={{ backgroundColor: 'black', flex: 1 }}>
                    <Text>Captured & Scanned Images:</Text>
                    <FlatList
                        data={imageUris}
                        horizontal
                        keyExtractor={(item, idx) => idx.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item }} style={styles.imagePreview} />
                            </View>
                        )}
                    />
                    <TouchableOpacity onPress={saveFiles} style={styles.saveBtn}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.footer}>

            </View>
            <Dialog.Container visible={renameModal}>
                <Dialog.Title>Type your desired name.</Dialog.Title>
                <Dialog.Input value={rename} onChangeText={(val) => setRename(val)} />
                <Dialog.Button label="Cancel" onPress={() => setRenameModal(false)} />
                <Dialog.Button
                    label="OK"
                    onPress={() => {
                        setRenameModal(false);
                    }}
                />
            </Dialog.Container>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',

    },
    header: {
        width: '100%',
        height: 120,
        backgroundColor: '#014955',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: 20
    },
    imagePreview: {
        width: 100,
        height: 100,
        margin: 10,
    },
    saveBtn: {
        backgroundColor: "#014955",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: 200
    },
    saveText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    rename: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: '50%',
        overflow: 'yes'
    },
    renameText: {
        color: 'white',
        fontSize: 15
    },
    input: {
        width: '50%',
        padding: 15,
        marginVertical: 10,
        backgroundColor: 'transparent',
        borderRadius: 8,
        fontSize: 16,
        color: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        borderStyle: 'dotted'
    },
    footer: {
        width: '100%',
        height: 100,
        backgroundColor: '#014955',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: 20
    }
})
export default ImageCapture;