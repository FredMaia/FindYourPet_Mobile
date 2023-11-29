import React, { useState, useEffect, useRef } from "react";
import { Dimensions, View, Text, Image, FlatList, StyleSheet } from "react-native";
import { LOCAL_IP } from "@env"

export function Card(props) {

    const baseURL = `http://${LOCAL_IP}:3001/`
    return (
        <View
            style={{
                width: Dimensions.get('screen').width * 0.8,
                alignItems: "center",
                marginHorizontal: 40,
                height: 300,
                borderRadius: 30,
            }}
        >
            <View style={{ width: "100%", marginLeft: 20, marginBottom: 15 }}>
                <Text style={{ fontWeight: 'bold' }}>Pet owner: {props.petOwner}</Text>
                <Text style={{ fontWeight: 'bold' }}>Pet name: {props.petName}</Text>
            </View>
            <Image

                source={{
                    uri: baseURL + props.petImage,
                }}
                style={{
                    aspectRatio: 4 / 3,
                    width: "100%",
                    alignSelf: "center",
                    borderRadius: 30,
                }}
            />
        </View>
    )
}