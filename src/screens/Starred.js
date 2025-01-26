import React, { useCallback, useState } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList, Alert, Modal, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Foundation from "react-native-vector-icons/Foundation";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { launchCamera } from "react-native-image-picker";
import realm from "../db/realmSchema";
import { PDFDocument } from "pdf-lib";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { useFocusEffect } from "@react-navigation/native";

const date = Date.now();

const Starred = ({ route }) => {
    const [imageUris, setImageUris] = useState([]);
    const [files, setFiles] = useState([]);
    const numColumns = 3;
    const { viewData = 'list' } = route.params || {};

    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");

    const handlePress = () => {
        setVisible(false);
    }


    // Fetch files from Realm on component mount
    useFocusEffect(
        useCallback(() => {
            const data = realm.objects("Document").filtered("starred == true AND deleted == 0");
            setFiles([...data]);
        }, [])
    );

    function handleOptions(item) {
        setSelectedItem(item);
        setVisible(true);

    }

    const handleDuplicate = (id) => {
        try {
            // Find the document with the given ID
            const document = realm.objectForPrimaryKey("Document", id);
            if (!document) {
                console.warn(`Document with ID ${id} not found.`);
                Alert.alert("Error", "The document could not be found.");
                return;
            }

            // Generate a new unique ID for the duplicate
            const newId = new Date().getTime();

            // Create the duplicate document
            realm.write(() => {
                realm.create("Document", {
                    id: parseInt(newId),
                    name: `${document.name} (Copy)`,
                    filePath: document.filePath,
                    createdAt: new Date().toISOString(),
                    createdDate: new Date().toLocaleDateString(),
                    createdTime: new Date().toLocaleTimeString(),
                    updatedAt: new Date().toISOString(),
                    updatedDate: new Date().toLocaleDateString(),
                    updatedTime: new Date().toLocaleTimeString(),
                    lastOpened: null,
                    deleted: 0,
                    starred: document.starred,
                });
            });

            // Refresh the files list
            setFiles([...realm.objects("Document").filtered("starred == true AND deleted == 0")]);
            setVisible(false);
            Alert.alert("Success", "Document duplicated successfully.");
        } catch (error) {
            console.error("Error duplicating document:", error);
            Alert.alert("Error", "Failed to duplicate the document.");
        }
    };

    const handleStar = (id) => {
        try {
            // Start a Realm write transaction
            realm.write(() => {
                // Find the document with the given id
                const document = realm.objectForPrimaryKey("Document", id);
                // If the document exists, update the `deleted` property
                if (document) {
                    document.starred = false;
                    setFiles([...realm.objects("Document").filtered("starred == true AND deleted == 0")]); // Refresh the files list
                    Alert.alert("Success", "File is removed from your favourites.");
                    setVisible(false);
                } else {
                    console.warn(`Document with id ${id} not found.`);
                }
            });
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };

    const handleDelete = (id) => {
        try {
            // Start a Realm write transaction
            realm.write(() => {
                // Find the document with the given id
                const document = realm.objectForPrimaryKey("Document", id);
                // If the document exists, update the `deleted` property
                if (document) {
                    document.deleted = 1;
                    setFiles([...realm.objects("Document").filtered("starred == true AND deleted == 0")]); // Refresh the files list
                    setVisible(false);
                } else {
                    console.warn(`Document with id ${id} not found.`);
                }
            });
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };




    const renderFile = ({ item }) => {
        const handleFilePress = async () => {
            try {
                await FileViewer.open(item.filePath, {
                    showOpenWithDialog: true, // Optional: shows an "Open With" dialog
                });
            } catch (error) {
                console.error("Error opening file:", error);
                Alert.alert("Error", "Failed to open the file.");
            }
        };
        return (
            <View style={{ flexDirection: viewData === 'grid' ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: viewData === 'grid' ? 0 : 1, borderColor: "#ccc" }}>
                <TouchableOpacity style={viewData === 'grid' ? styles.gridItems : styles.listItems} onPress={handleFilePress}>
                    <AntDesign
                        name={item.name.endsWith(".pdf") ? "pdffile1" : "jpgfile1"}
                        size={viewData === 'grid' ? 30 : 40}
                        color={item.name.endsWith(".pdf") ? "red" : "#014955"}
                    />
                    <Text>{item.name.substring(0, 30)}{item.name.length > 30 ? item.name.endsWith(".pdf") ? '.. .pdf' : '.. .jpg' : ''}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleOptions(item)} style={{ position: 'relative' }}>
                    <SimpleLineIcons name={viewData === "grid" ? 'options' : "options-vertical"} size={20} color="#014955" style={{ marginLeft: 10 }} />
                    <Modal visible={visible} transparent animationType="slide">
                        <TouchableOpacity
                            style={styles.overlay}
                            onPress={() => setVisible(false)}
                        />
                        <View style={styles.dropdown}>
                            <View style={{ borderBottomWidth: 1, borderColor: "#ccc", alignItems: 'flex-start', justifyContent: 'center', height: 40, paddingBottom: 8, marginBottom: 10 }}>
                                <AntDesign name="close" size={25} color="#014955" style={{ marginLeft: 10 }} onPress={() => setVisible(false)} />
                            </View>
                            <Pressable key='Edit' onPress={() => handlePress('Edit')} style={styles.modalPressable} >
                                <FontAwesome name='edit' size={24} color='black' style={{ width: 30 }} />
                                <Text style={styles.modalText}>Edit PDF</Text>
                            </Pressable>
                            <Pressable key='Export PDF' onPress={() => handlePress('Export PDF')} style={styles.modalPressable} >
                                <Foundation name='page-export-pdf' size={24} color='black' style={{ width: 30 }} />
                                <Text style={styles.modalText}>Export PDF</Text>
                            </Pressable>
                            <Pressable key='Compress PDF' onPress={() => handlePress('Compress PDF')} style={styles.modalPressable} >
                                <MaterialIcons name='compress' size={24} color='black' style={{ width: 30 }} />
                                <Text style={styles.modalText}>Compress PDF</Text>
                            </Pressable>
                            <Pressable key='Send' onPress={() => handlePress('Send')} style={styles.modalPressable} >
                                <MaterialCommunityIcons name='email-send-outline' size={24} color='black' style={{ width: 30 }} />
                                <Text style={styles.modalText}>Send</Text>
                            </Pressable>
                            <Pressable key='Lock' onPress={() => handlePress('Lock')} style={styles.modalPressable} >
                                <MaterialIcons name='password' size={24} color='black' style={{ width: 30 }} />
                                <Text style={styles.modalText}>Set Password</Text>
                            </Pressable>
                            <Pressable key='Star' onPress={() => handleStar(selectedItem.id)} style={styles.modalPressable} >
                                <FontAwesome name='star' size={24} color='black' style={{ width: 30 }} />
                                <Text style={styles.modalText}>Unstar</Text>
                            </Pressable>
                            <Pressable key='Rename' onPress={() => handlePress('Rename')} style={styles.modalPressable} >
                                <MaterialCommunityIcons name='rename-box' size={24} color='black' style={{ width: 30 }} />
                                <Text style={styles.modalText}>Rename</Text>
                            </Pressable>
                            <Pressable key='Duplicate' onPress={() => handleDuplicate(selectedItem.id)} style={styles.modalPressable} >
                                <MaterialCommunityIcons name='content-duplicate' size={24} color='black' style={{ width: 30 }} />
                                <Text style={styles.modalText}>Duplicate</Text>
                            </Pressable>
                            <Pressable key='Delete' onPress={() => handleDelete(selectedItem.id)} style={styles.modalPressable} >
                                <AntDesign name='delete' size={24} color='black' style={{ width: 30 }} />
                                <Text style={styles.modalText}>Delete</Text>
                            </Pressable>
                        </View>
                    </Modal>
                </TouchableOpacity>
            </View>
        );

    }

    return (
        <View style={styles.container}>
            {viewData === 'grid' ? (
                <FlatList
                    data={files}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderFile}
                    numColumns={numColumns}
                    columnWrapperStyle={styles.gridRow}
                    key={`grid-${numColumns}`}
                />
            ) : (
                <FlatList
                    data={files}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderFile}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        maxWidth: '100%'
    },
    gridRow: {
        justifyContent: "flex-start",
    },
    gridItems: {
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
        padding: 10,
        height: 120,
        width: 110,
        borderRadius: 10,
        borderWidth: .2,
        gap: 10
    },
    listItems: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        justifyContent: 'flex-start',
        gap: 20
    },
    icon: {
        marginRight: 10,
    },
    imagePreview: {
        width: 100,
        height: 100,
        margin: 10,
    },
    cameraBtn: {
        position: "absolute",
        bottom: 20,
        right: 10,
        backgroundColor: "#014955",
        borderRadius: 50,
        padding: 10,
        width: 120,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: "center",
    },
    cameraTxt: {
        color: "white",
        fontSize: 18,
        marginRight: 5,
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
    button: {
        padding: 10,
        backgroundColor: "#014955",
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    dropdown: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 10,
        height: '52%',
        marginLeft: 2,
        marginRight: 2
    },
    dropdownItem: {
        padding: 10,
    },
    itemText: {
        fontSize: 16,
    },
    modalText: {
        fontSize: 16
    },
    modalPressable: {
        flexDirection: 'row',
        padding: 10, 
        width: '100%',
        gap: 15,
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
});

export default Starred;