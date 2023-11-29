import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet, Alert } from "react-native";

import { AuthContext } from "../contexts/auth";

import { useNavigation } from "@react-navigation/native";

const ListItem = ({ data, search}) => {

  const { userBeforeRegister, setUserBeforeRegister } = useContext(AuthContext)

  const navigation = useNavigation();

  const getCity = (name) => {
    Alert.alert(data.nome);
    console.log(search)
    if (search == "city") {
      setUserBeforeRegister(prevState => ({
        ...prevState, 'city': name
      }));
      navigation.navigate("Register")
    } else {
      setUserBeforeRegister(prevState => ({
        ...prevState, 
        'state': name
      }));
    //   setUserBeforeRegister((previousObject) => ({
    //     ...previousObject,
    //     "city": name
    // }))
      // navigation.navigate("Register")
      navigation.navigate("SelectCity")
    }
  }
  return (
    <TouchableOpacity style={styles.item} onPress={() => getCity(data.nome)}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemP1} >{data.nome}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginLeft: 30,
    marginRight: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingTop: 15,
    paddingBottom: 15,
  },
  itemPhoto: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  itemInfo: {
    marginLeft: 20,
  },
  itemP1: {
    fontSize: 22,
    color: 'black',
    marginBottom: 5
  },
  itemP2: {
    fontSize: 18,
    color: 'black',
  },
});

export default ListItem;
