import React, { createContext, useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"

import Axios from "../services/Axios.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({})

export default AuthProvider = ({ children }) => {
    const [user, setUser] = useState({})
    const [userBeforeRegister, setUserBeforeRegister] = useState({})
    const [estaLogado, setLogado] = useState(false)
    const [fotoUsuario, setFotoUsuario] = useState("")

    const navigation = useNavigation()

    async function storeUser(token) {
        await AsyncStorage.setItem("token", token);
    }

    async function getUserFromMobileData() {
        try {
            const response = await AsyncStorage.getItem("token");
            if (response) {
                Axios.get("/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${response}`
                    }
                }).then(res => {
                    setUser({
                        email: res.data.email,
                        username: res.data.name,
                        id: res.data.id,
                        img: res.data.userProfilePhoto,
                        city: res.data.city,
                        state: res.data.state,
                        token: response,
                        number: res.data.phoneNumber,
                    })
                    setLogado(true)
                }).catch(err => {
                    // console.log(err);
                    console.log("Sem token de login no async storage")
                })
            } else {
                console.log("Sem token de login no async storage")
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getUserFromMobileData();
    }, [])

    function signIn(email, password) {
        Axios.post("/auth/login", { email, password })
            .then(res => {
                setLogado(true)
                console.log("Dados do usuário logado: ")
                console.log(res.data)
                const newUser = {
                    email: email,
                    username: res.data.username,
                    id: res.data.id,
                    token: res.data.token,
                    img: res.data.img,
                    city: res.data.city,
                    state: res.data.state,
                    number: res.data.phoneNumber
                }
                const token = res.data.token;
                setUser(newUser)
                storeUser(token);
                navigation.navigate("Posts")
            }).catch(err => {
                console.error(err)
            })
    }

    return (
        <AuthContext.Provider value={{
            signIn,
            user, setUser,
            estaLogado, setLogado,
            fotoUsuario, setFotoUsuario,
            userBeforeRegister, setUserBeforeRegister
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
};