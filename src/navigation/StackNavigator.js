// StackNavigator.js 

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TopTabs from "./TopTabs";
// import CameraScreen from '../screens/CameraScreen';
// import PDFScreen from '../screens/PdfScreen';
// import RecentFilesScreen from '../screens/RecentScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => { 
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeScreen" component={TopTabs} options={{ headerShown: false }} />
            {/* <Stack.Screen name="CameraScreen" component={CameraScreen} />
            <Stack.Screen name="PDFScreen" component={PDFScreen} />
            <Stack.Screen name="RecentFilesScreen" component={RecentFilesScreen} /> */}
        </Stack.Navigator>
    );
}

export default StackNavigator;