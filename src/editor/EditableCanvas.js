import React, { useState } from "react";
import { View, Text, Image, PanResponder, StyleSheet, TouchableOpacity } from "react-native";

const EditableCanvas = ({ mode, onSave }) => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  const handleAddElement = () => {
    if (mode === "text") {
      setElements((prev) => [
        ...prev,
        { type: "text", content: "New Text", x: 100, y: 100 },
      ]);
    } else if (mode === "image") {
      setElements((prev) => [
        ...prev,
        {
          type: "image",
          uri: "https://via.placeholder.com/100", // Example image
          x: 100,
          y: 100,
          width: 100,
          height: 100,
        },
      ]);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (selectedElement !== null) {
        setElements((prev) =>
          prev.map((el, index) =>
            index === selectedElement
              ? { ...el, x: el.x + gesture.dx, y: el.y - gesture.dy }
              : el
          )
        );
      }
    },
    onPanResponderRelease: () => {
      setSelectedElement(null);
    },
  });

  const handleElementPress = (index) => {
    setSelectedElement(index);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Add Button for New Element */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddElement}
      >
        <Text style={styles.addButtonText}>+ Add {mode}</Text>
      </TouchableOpacity>

      {/* Render Elements */}
      {elements.map((element, index) => (
        <TouchableOpacity
          key={index}
          style={{
            position: "absolute",
            top: element.y,
            left: element.x,
          }}
          onPress={() => handleElementPress(index)}
          {...panResponder.panHandlers}
        >
          {element.type === "text" ? (
            <Text style={{ fontSize: 24 }}>{element.content}</Text>
          ) : (
            <Image
              source={{ uri: element.uri }}
              style={{ width: element.width, height: element.height }}
            />
          )}
        </TouchableOpacity>
      ))}

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => onSave(elements)}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  saveButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default EditableCanvas;
