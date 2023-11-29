import React from "react"
import { NavigationContainer } from '@react-navigation/native';

import AuthProvider from "./src/contexts/auth.js"

import TrocarNavegador from "./src/TrocarNavegador.js";


export default function App() {

  return (
    <NavigationContainer>
      <AuthProvider>
        <TrocarNavegador />
      </AuthProvider>
    </NavigationContainer>
  );
}
