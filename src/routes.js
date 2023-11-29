import { createStackNavigator } from "@react-navigation/stack"
import Login from './pages/NaoLogado/Login';
import Forgot from './pages/NaoLogado/Forgot';
import Register from './pages/NaoLogado/Register';
import bottom from "./routesBottom"
import {SelectState} from "./pages/NaoLogado/SelectState.js";
import {SelectCity} from "./pages/NaoLogado/SelectCity.js";

const Stack = createStackNavigator();

function Routes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Forgot" component={Forgot} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="SelectState" component={SelectState} options={{title: 'Select your state'}}/>
            <Stack.Screen name="SelectCity" component={SelectCity} options={{title: 'Select your city'}}/>
            <Stack.Screen name="bottom" component={bottom} options={{ headerShown: false }}  />
        </Stack.Navigator>
    );
}


export default Routes;