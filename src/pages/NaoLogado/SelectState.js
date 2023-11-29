import React, {useState, useEffect} from 'react'
import {Text, View} from "react-native"
import ListItem from '../../components/ListItem'
import {SelectMultiple} from '../../components/SelectMultiple.js'

export const SelectState = () => {
  return (
    <View style={{flex: 1}}>
        <SelectMultiple search="state"/>
    </View>
  )
}
