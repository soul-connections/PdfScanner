// StackNavigator.js 

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TopTabs from "./TopTabs";
import PDFEditorScreen from '../editor/PdfEditorScreen';
import ImageCapture from '../scanner/ImageCapture';

const Stack = createNativeStackNavigator();

const StackNavigator = () => { 
    return (
        <Stack.Navigator >
            <Stack.Screen name="HomeScreen" component={TopTabs} options={{ headerShown: false }} />
            <Stack.Screen name="PdfEditor" component={PDFEditorScreen} />
            <Stack.Screen name="Camera" component={ImageCapture} options={{ headerShown: false } } />

        </Stack.Navigator>
    );
}

export default StackNavigator;