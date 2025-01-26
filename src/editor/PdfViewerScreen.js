import React from "react";
import { View, Button } from "react-native";
import Pdf from "react-native-pdf";

const PDFViewerScreen = ({ navigation, route }) => {
  const { pdfUri } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <Pdf
        source={{ uri: pdfUri }}
        style={{ flex: 1 }}
      />
      <Button
        title="Edit PDF"
        onPress={() => navigation.navigate("PDFEditorScreen", { pdfUri })}
      />
    </View>
  );
};

export default PDFViewerScreen;
