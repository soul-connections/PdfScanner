import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Toolbar = ({ currentTool, setCurrentTool, onSaveText }) => {
  const tools = [
    { name: "Add Text", type: "text" },
    { name: "Add Image", type: "image" },
    { name: "Draw", type: "draw" },
  ];

  const handleToolSelect = (toolType) => {
    setCurrentTool(toolType);
    if (toolType === "text") {
      // Example for adding text
      onSaveText("Sample Text", 100, 500); // Example coordinates
    }
  };

  return (
    <View style={styles.toolbar}>
      {tools.map((tool) => (
        <TouchableOpacity
          key={tool.type}
          style={[
            styles.toolButton,
            currentTool === tool.type && styles.activeTool,
          ]}
          onPress={() => handleToolSelect(tool.type)}
        >
          <Text style={styles.toolText}>{tool.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  toolButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  activeTool: {
    backgroundColor: "#aaa",
  },
  toolText: {
    fontSize: 16,
  },
});

export default Toolbar;
