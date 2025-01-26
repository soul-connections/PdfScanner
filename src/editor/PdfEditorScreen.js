import React, { useState } from "react";
import { View, StyleSheet, Button, Text, TouchableOpacity, Image } from "react-native";
import Pdf from "react-native-pdf";
import EditableCanvas from "../components/EditableCanvas";
import { PDFDocument, rgb } from "pdf-lib";
import * as RNFS from "react-native-fs";

const PDFEditorScreen = ({ route, navigation }) => {
  const { pdfUri } = route.params;
  const [pdfPath, setPdfPath] = useState(pdfUri); // Current PDF path
  const [editingMode, setEditingMode] = useState(null); // Text or Image editing

  const handleSave = async (elements) => {
    const pdfBytes = await RNFS.readFile(pdfPath, "base64");
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const firstPage = pdfDoc.getPages()[0];

    for (const element of elements) {
      if (element.type === "text") {
        firstPage.drawText(element.content, {
          x: element.x,
          y: element.y,
          size: 24,
          color: rgb(0, 0, 0),
        });
      } else if (element.type === "image") {
        const imageBytes = await RNFS.readFile(element.uri.replace("file://", ""), "base64");
        const embeddedImage = await pdfDoc.embedPng(imageBytes);
        firstPage.drawImage(embeddedImage, {
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height,
        });
      }
    }

    const updatedPdfBytes = await pdfDoc.save();
    const updatedPath = `${RNFS.DocumentDirectoryPath}/updated_document.pdf`;
    await RNFS.writeFile(updatedPath, updatedPdfBytes, "base64");
    setPdfPath(`file://${updatedPath}`);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* PDF Viewer */}
      <Pdf
        source={{ uri: pdfPath }}
        style={{ flex: 1 }}
      />

      {/* Editable Canvas Overlay */}
      <EditableCanvas
        mode={editingMode}
        onSave={handleSave}
      />

      {/* Toolbar for Modes */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => setEditingMode("text")}
        >
          <Text>Add Text</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => setEditingMode("image")}
        >
          <Text>Add Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => setEditingMode(null)}
        >
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  toolButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
});

export default PDFEditorScreen;
