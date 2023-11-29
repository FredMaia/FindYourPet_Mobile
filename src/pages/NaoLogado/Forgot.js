import React from "react";

import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from "react-native";

import { useNavigation } from "@react-navigation/native"

export default () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={{marginBottom: 50, fontWeight: "bold"}}>Type your email and a token will be sent</Text>
            <TextInput
                style={styles.input}
                placeholder="E-mail"
            />
            <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Being developed")}>
                <Text style={{color: "white"}}>Send token</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    input: {
        width: '80%',
        height: 45,
        padding: 20,
        backgroundColor: 'whitesmoke',
        borderRadius: 4,
        marginBottom: 14,
        padding: 8,
    },
    button: {
        width: '80%',
        height: 45,
        backgroundColor: '#1793a6',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
})