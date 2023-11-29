import React, {useState, useEffect} from 'react'
import { Text, View } from "react-native"
import ListItem from '../../components/ListItem'
import { SelectMultiple } from '../../components/SelectMultiple.js'

export const SelectCity = () => {

    return (
        <View style={{ flex: 1 }}>
            <SelectMultiple search="city"/>
        </View>
    )
}
