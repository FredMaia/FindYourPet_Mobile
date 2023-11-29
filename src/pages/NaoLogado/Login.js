import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../../contexts/auth";

import styles from "./LoginAndRegisterStyle.js";

import { Entypo } from '@expo/vector-icons';

import { useForm, Controller } from "react-hook-form"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const signInFormSchema = yup.object().shape({
    email: yup.string().required("Email is a required field").email("Put a valid email"),
    password: yup.string().required("Password is a required field")
})

export default () => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signInFormSchema)
    })

    const [seePassword, setSeePassword] = useState(true);

    const navigation = useNavigation();

    const { signIn } = useContext(AuthContext);

    const handleLogin = (data) => {
        signIn(data.email, data.password);
    }

    return (
        <KeyboardAvoidingView style={{ paddingTop: 100 }}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Find your pet</Text>

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="E-mail"
                                style={styles.input}
                                onChangeText={value => onChange(value)}
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
                                    placeholder="Password"
                                    secureTextEntry={seePassword}
                                    style={styles.input}
                                    onChangeText={value => onChange(value)}
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



                    <TouchableOpacity onPress={handleSubmit(handleLogin)} style={styles.button}>
                        <Text style={styles.buttonText}>Sign in</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.text, { marginBottom: 20 }]} onPress={() => navigation.navigate("Forgot")}>
                        <Text>Forgot passoword?</Text>
                    </TouchableOpacity>

                    <Text style={styles.text}>Don't have an account?</Text>

                    <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.button}>
                        <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity>

                    <View>
                        <Text style={{ marginTop: 200 }}>&#169; by fredmaia</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>

    )

}

