import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";
import { PDFDocument, rgb } from "pdf-lib";
import * as RNFS from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PDFEditorScreen = () => {
    const [pdfPath, setPdfPath] = useState(null); // Path to the PDF
    const [editingElements, setEditingElements] = useState([]); // Text/Image overlays
    const [editingMode, setEditingMode] = useState(null); // 'text' or 'image'
    const [tempText, setTempText] = useState(""); // Temporary text for adding

    useEffect(() => {
        // Load the PDF URI from AsyncStorage
        const loadPdfUri = async () => {
            try {
                const storedPdfUri = await AsyncStorage.getItem("pdfUri");
                if (storedPdfUri) {
                    setPdfPath(storedPdfUri);
                } else {
                    Alert.alert("No PDF Found", "Please set a valid PDF URI.");
                }
            } catch (error) {
                console.error("Error loading PDF URI from AsyncStorage:", error);
            }
        };

        loadPdfUri();
    }, []);

    // Save edits to the PDF
    const handleSave = async () => {
        if (!pdfPath) {
            Alert.alert("Error", "No PDF file loaded.");
            return;
        }

        try {
            const pdfBytes = await RNFS.readFile(pdfPath.replace("file://", ""), "base64");
            const pdfDoc = await PDFDocument.load(pdfBytes);

            const pages = pdfDoc.getPages();
            const firstPage = pages[0]; // Edit the first page as an example

            // Apply all text elements to the first page
            for (const element of editingElements) {
                if (element.type === "text") {
                    firstPage.drawText(element.content, {
                        x: element.x,
                        y: element.y,
                        size: 24,
                        color: rgb(0, 0, 0),
                    });
                }
            }

            // Save the updated PDF
            const updatedPdfBytes = await pdfDoc.save();
            const updatedPath = `${RNFS.DocumentDirectoryPath}/updated_document.pdf`;
            await RNFS.writeFile(updatedPath, updatedPdfBytes, "base64");

            setPdfPath(`file://${updatedPath}`);
            setEditingElements([]); // Clear edits after saving
            Alert.alert("Success", "PDF saved successfully!");
        } catch (error) {
            console.error("Error saving PDF:", error);
            Alert.alert("Error", "Failed to save PDF.");
        }
    };

    // Add a new text element
    const addTextElement = (x, y) => {
        if (tempText.trim()) {
            setEditingElements([
                ...editingElements,
                { type: "text", content: tempText, x, y },
            ]);
            setTempText("");
            setEditingMode(null);
        } else {
            Alert.alert("Error", "Text cannot be empty.");
        }
    };

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
            
            <Text style={styles.pdfPathText}>PDF Path: {pdfPath}</Text>

            {/* Editable Canvas */}
            {editingElements.map((element, index) =>
                element.type === "text" ? (
                    <Text
                        key={index}
                        style={{
                            position: "absolute",
                            top: element.y,
                            left: element.x,
                            color: "black",
                            fontSize: 16,
                        }}
                    >
                        {element.content}
                    </Text>
                ) : null
            )}

            {/* Text Input for Adding Text */}
            {editingMode === "text" && (
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter text"
                    value={tempText}
                    onChangeText={setTempText}
                    onSubmitEditing={() => addTextElement(50, 500)} // Example position
                />
            )}

            {/* Toolbar */}
            <View style={styles.toolbar}>
                <TouchableOpacity
                    style={styles.toolButton}
                    onPress={() => setEditingMode("text")}
                >
                    <Text style={styles.buttonText}>Add Text</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.toolButton}
                    onPress={handleSave}
                >
                    <Text style={styles.buttonText}>Save PDF</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pdfPathText: {
        marginBottom: 10,
        fontSize: 14,
        color: "#333",
    },
    toolbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    toolButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 15,
        backgroundColor: "#007BFF",
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    textInput: {
        position: "absolute",
        bottom: 100,
        left: 10,
        right: 10,
        height: 50,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        paddingHorizontal: 10,
    },
});

export default PDFEditorScreen;
