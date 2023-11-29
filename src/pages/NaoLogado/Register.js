import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../../contexts/auth"
// import axios from "axios"
import Axios from "../../services/Axios.js"

import styles from "./LoginAndRegisterStyle.js";

import { Entypo } from '@expo/vector-icons';

import { useForm, Controller } from "react-hook-form"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const signInFormSchema = yup.object().shape({
    name: yup.string().required("Name is a required field"),
    email: yup.string().required("Email is a required field").email("Put a valid email"),
    password: yup.string().required("Password is a required field"),
    phone: yup.string().required("Phone number is a required field")
})

export default () => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signInFormSchema)
    })
    const [seePassword, setSeePassword] = useState(true);

    const navigation = useNavigation();

    const { userBeforeRegister, setUserBeforeRegister } = useContext(AuthContext);

function signUp() {
            Axios.post("auth/register", {
                name: userBeforeRegister.name,
                email: userBeforeRegister.email,
                password: userBeforeRegister.password,
                phoneNumber: userBeforeRegister.phone,
                state: userBeforeRegister.state,
                city: userBeforeRegister.city,
            })
                .then(res => {
                    Alert.alert("Conta registrada com sucesso.")
                    navigation.navigate("Login")
                }).catch(err => {
                    console.error("erro ao registrar", err)
                })
        }

const handleSignUp = (data) => {
        console.log(data)
        if (userBeforeRegister.city && userBeforeRegister.state) {
            signUp();
        } else {
            Alert.alert("Go to next to select your location")
        }
    }

    return (
        <KeyboardAvoidingView style={{ paddingTop: 30 }}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Create an account</Text>

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Type your name"
                                style={styles.input}
                                onChangeText={value => {
                                    onChange(value)
                                    setUserBeforeRegister({ ...userBeforeRegister, name: value })
                                }}
                                value={value}
                            />
                        )}
                        name="name"
                    />

                    {!!errors.name && <Text style={styles.errorMessage}>{errors.name.message}</Text>}

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Type your e-mail"
                                style={styles.input}
                                onChangeText={value => {
                                    onChange(value)
                                    setUserBeforeRegister({ ...userBeforeRegister, email: value })
                                }}
                                value={value}
                            />
                        )}
                        name="email"
                    />

                    {!!errors.email && <Text style={styles.errorMessage}>{errors.email.message}</Text>}

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputPassword}>
                                <TextInput
                                    placeholder="Type your password"
                                    secureTextEntry={seePassword}
                                    style={styles.input}
                                    onChangeText={value => {
                                        onChange(value)
                                        setUserBeforeRegister({ ...userBeforeRegister, password: value })
                                    }}
                                    value={value}
                                />
                                <View style={{ alignItems: "center", justifyContent: "center", height: 45 }}>
                                    <TouchableOpacity onPress={() => setSeePassword(!seePassword)}>
                                        <View style={{ width: '100%' }}>
                                            {seePassword ?
                                                <Entypo name="eye-with-line" size={24} color="#1793a6" /> :
                                                <Entypo name="eye" size={24} color="#1793a6" />
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        name="password"
                    />

                    {!!errors.password && <Text style={styles.errorMessage}>{errors.password.message}</Text>}

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Type your phone"
                                style={styles.input}
                                onChangeText={value => {
                                    onChange(value)
                                    setUserBeforeRegister({ ...userBeforeRegister, phone: value })
                                }}
                                value={value}
                            />
                        )}
                        name="phone"
                    />

                    {!!errors.phone && <Text style={styles.errorMessage}>{errors.phone.message}</Text>}

                    {userBeforeRegister.city ? (
                        <View style={styles.text}>
                            <Text>State: {userBeforeRegister.state}</Text>
                            <Text>City: {userBeforeRegister.city}</Text>
                        </View>
                    )
                        : (
                            <TouchableOpacity style={styles.button} onPress={() => {
                                //verificar se preencheu o resto
                                console.log(userBeforeRegister.name)
                                console.log(userBeforeRegister.email)
                                console.log(userBeforeRegister.password)
                                console.log(userBeforeRegister.phone)
                                navigation.navigate("SelectState")
                            }}>
                                <Text style={styles.buttonText}>Next</Text>
                            </TouchableOpacity>
                        )
                    }

                    <TouchableOpacity style={styles.button} onPress={handleSubmit(handleSignUp)}>
                        <Text style={styles.buttonText}>Create account</Text>
                    </TouchableOpacity>

                    <Text style={{ marginTop: 200 }}>&#169; by fredmaia</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}