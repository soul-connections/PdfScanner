// App.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './src/navigation/BottomTabs';

export default function App() {
  return ( 
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}