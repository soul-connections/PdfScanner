import React, { useState } from "react";
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

const date = Date.now();

const Recent = ({ route }) => {
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
    React.useEffect(() => {
        const data = realm.objects("Document").filtered("deleted = 0");
        setFiles([...data]);
    }, []);

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
                } else {
                    // Add the captured image URI to the array
                    const newImageUri = response.assets[0]?.uri;
                    if (newImageUri) {
                        setImageUris((prevUris) => [...prevUris, newImageUri]);
                        console.log("Captured Image URI: ", newImageUri);
                    } else {
                        console.warn("No URI found for the captured image.");
                    }
                }
            }
        );
    };

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

    const handleSaveOption = async (index) => {
        if (imageUris.length === 0) {
            Alert.alert("Error", "No images available to save.");
            return;
        }

        const now = new Date();
        const createdAt = now.toISOString();
        const createdDate = now.toLocaleDateString();
        const createdTime = now.toLocaleTimeString();

        if (index === 0) {
            console.warn(imageUris);
            // Save as JPG
            imageUris.forEach((uri, idx) => {
                const fileName = `document_${new Date().getTime()}.jpg`;
                realm.write(() => {
                    realm.create("Document", {
                        id: parseInt(`${new Date().getTime()}`),
                        name: fileName,
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
        } else if (index === 1) {
            try {
                // Save as PDF
                const pdfUri = await generatePDF(imageUris); // Pass the `imageUris` array here
                const fileName = `document_${new Date().getTime()}.pdf`;
                realm.write(() => {
                    realm.create("Document", {
                        id: parseInt(`${new Date().getTime()}`),
                        name: fileName,
                        filePath: pdfUri,
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
            } catch (error) {
                console.error("Error saving PDF:", error);
                Alert.alert("Error", "Failed to generate PDF.");
            }
        }

        setFiles([...realm.objects("Document").filtered("deleted = 0")]); // Refresh the files list
        setImageUris([]); // Clear captured image URIs
    };

    const generatePDF = async (imageUris) => {
        console.log("Generating PDF with image URIs:", imageUris);

        if (!Array.isArray(imageUris) || imageUris.length === 0) {
            throw new Error("No valid images to create PDF.");
        }

        const pdfPath = `${RNFS.DocumentDirectoryPath}/document_${date}.pdf`;
        console.log("PDF Path:", pdfPath);

        try {
            const pdfDoc = await PDFDocument.create();
            console.log("PDF Document created.");

            for (const imageUri of imageUris) {
                console.log("Processing image URI:", imageUri);

                const filePath = imageUri.startsWith("file://") ? imageUri.replace("file://", "") : imageUri;

                try {
                    const imageBytes = await RNFS.readFile(filePath, "base64");
                    console.log("Image bytes read successfully.");

                    const extension = filePath.split(".").pop()?.toLowerCase();
                    let embeddedImage;
                    if (extension === "jpg" || extension === "jpeg") {
                        console.log("Embedding JPG image.");
                        embeddedImage = await pdfDoc.embedJpg(imageBytes);
                    } else if (extension === "png") {
                        console.log("Embedding PNG image.");
                        embeddedImage = await pdfDoc.embedPng(imageBytes);
                    } else {
                        console.warn(`Unsupported image format: ${filePath}`);
                        continue;
                    }

                    const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
                    page.drawImage(embeddedImage, {
                        x: 0,
                        y: 0,
                        width: embeddedImage.width,
                        height: embeddedImage.height,
                    });
                    console.log("Image added to PDF page.");
                } catch (imageError) {
                    console.error(`Error embedding image: ${filePath}`, imageError);
                    throw new Error("Failed to process an image.");
                }
            }

            const pdfBytes = await pdfDoc.save();
            console.log("PDF document saved to bytes.");

            // Convert to Base64 without Buffer
            const pdfBase64 = btoa(
                new Uint8Array(pdfBytes).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                )
            );
            console.log("PDF converted to base64.");

            await RNFS.writeFile(pdfPath, pdfBase64, "base64");
            console.log("PDF written to file system at:", pdfPath);

            return `file://${pdfPath}`;
        } catch (error) {
            console.error("Error during PDF generation:", error);
            throw new Error("Failed to generate PDF.");
        }
    };

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
            setFiles([...realm.objects("Document").filtered("deleted = 0")]);
            setVisible(false);
            Alert.alert("Success", "Document duplicated successfully.");
        } catch (error) {
            console.error("Error duplicating document:", error);
            Alert.alert("Error", "Failed to duplicate the document.");
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
                    setFiles([...realm.objects("Document").filtered("deleted = 0")]); // Refresh the files list
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
                    <Text>{item.name.substring(0, 30)}{item.name.length > 30 ? item.name.endsWith(".pdf") ? '......pdf' : '......jpg' : ''}</Text>
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
                                <Text>{selectedItem.id} </Text>
                            </View>
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
                            <Pressable key='Star' onPress={() => handlePress('Star')} style={styles.modalPressable} >
                                <FontAwesome name='star-o' size={24} color='black' style={{ width: 30 }} />
                                <Text style={styles.modalText}>Star</Text>
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



            {imageUris.length > 0 && (
                <View>
                    <Text>Captured Images:</Text>
                    <FlatList
                        data={imageUris}
                        horizontal
                        keyExtractor={(uri, idx) => idx.toString()}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={styles.imagePreview} />
                        )}
                    />
                    <TouchableOpacity onPress={saveFiles} style={styles.saveBtn}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity onPress={openCamera} style={styles.cameraBtn}>
                <Text style={styles.cameraTxt}>Scan</Text>
                <Ionicons name="camera-outline" size={30} color="white" />
            </TouchableOpacity>
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
        height: '50%',
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
        padding: 10, width: '100%',
        gap: 15,
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
});

export default Recent;