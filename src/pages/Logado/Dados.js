import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";

import { Card } from "../../components/Card";

import axios from "axios"
import Axios from "../../services/Axios.js"


export default () => {
    const [activeBanner, setActiveBanner] = useState();
    const [pets, setPets] = useState([]);

    useEffect(() => {
        Axios.get("/pets").then(res => {
            console.log("Pets achados recentemente: ");
            console.log(res.data);
            setPets(res.data)
        })
    }, [])

    const onViewableItemsChanged = ({ viewableItems }) => {
        setActiveBanner(viewableItems[0]?.index)
    }

    const viewabilityConfigCallbackPairs = useRef([
        {
            viewabilityConfig: {
                itemVisiblePercentThreshold: 50,
            },
            onViewableItemsChanged,
        }
    ])

    const refreshPets = () => {
        Axios.get("/pets").then(res => {
            Alert.alert("Pets atualizados com sucesso")
            setPets(res.data);
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <View style={{ flexDirection: "column", gap: 300, marginTop: 100 }}>
            <View>
                <Text style={styles.title}>Recently found pets:</Text>
                <FlatList
                    data={pets}
                    renderItem={({ item, index }) => (
                        <Card
                            petOwner={item.petOwner}
                            petName={item.petName}
                            petImage={item.petImage}
                        />
                    )}
                    pagingEnabled
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    horizontal={true}
                    keyExtractor={(item, index) => String(index)}
                />
            </View>
            <View>
                <FlatList
                    data={pets}
                    renderItem={({ item, index }) => (
                        <View
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 4,
                                backgroundColor: activeBanner === index ? "black" : "gray",
                                marginHorizontal: 3,
                            }}
                        />
                    )}
                    style={{
                        marginTop: 20,
                        alignSelf: "center",
                    }}
                    scrollEnabled={false}
                    horizontal
                    keyExtractor={(item, index) => String(index)}
                />
            </View>
            <View style={{ marginTop: 100, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity style={styles.button} onPress={refreshPets}>
                    <Text style={{ color: "white" }}>Refresh</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        padding: 40,
    },
    button: {
        backgroundColor: "#1793a6",
        padding: 10,
        width: '40%',
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
})