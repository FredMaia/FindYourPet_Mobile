import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import Posts from "./pages/Logado/Posts";
import Info from "./pages/Logado/Info";
import Dados from "./pages/Logado/Dados";

import { AuthContext } from "./contexts/auth";

const Tab = createBottomTabNavigator();

export default () => {
    const { user } = useContext(AuthContext)

    return (
        <Tab.Navigator
            initialRouteName="Posts"
            screenOptions={
                {
                    "tabBarActiveTintColor": "#1793a6",
                    "tabBarInactiveTintColor": "#fafafa",
                    "tabBarActiveBackgroundColor": "#fafafa",
                    "tabBarInactiveBackgroundColor": "#1793a6",
                    "tabBarStyle": [
                        {
                            "display": "flex"
                        },
                        null
                    ]
                }
            }
        >

            <Tab.Screen
                name="Posts"
                options={{
                    tabBarIcon: (props) => <MaterialIcons name="list" {...props} />,
                    title: user.city + ", " + user.state
                }}
                component={Posts}
            />

            <Tab.Screen
                name="Data"
                options={{
                    tabBarIcon: (props) => <MaterialIcons name="list" {...props} />,
                    headerShown: false
                }}
                component={Dados}
            />

            <Tab.Screen
                name="Info"
                options={{
                    tabBarIcon: (props) => <MaterialIcons name="list" {...props} />
                }}
                component={Info}
            />

        </Tab.Navigator>
    )
}