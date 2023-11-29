import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import ListItem from "./ListItem"

import axios from "axios";

import { AuthContext } from "../contexts/auth";

export const SelectMultiple = (props) => {
  const { userBeforeRegister } = useContext(AuthContext);

  const [searchText, setSearchText] = useState("");
  const [states, setStates] = useState([]);
  const [statesFix, setStatesFix] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesFix, setCitiesFix] = useState([]);

  const [localizacaoSetada, setLocalizacaoSetada] = useState(false)
  const [localizacaoSetada2, setLocalizacaoSetada2] = useState(false)

  function renderItem({ item }) {
    return <ListItem data={item} search={props.search} />
  }

  const updateStates = (dados) => {
    const nomesEstados = dados.map(estado => estado);
    setStates(nomesEstados);
    setStatesFix(nomesEstados);
    setLocalizacaoSetada(true)
  }

  const updateCities = (dados) => {
    const nomesCidadesEstado = dados.filter(city => city.municipio.microrregiao.mesorregiao.UF.nome == userBeforeRegister.state);

    const nomesCidades = nomesCidadesEstado.map(estado => estado);
    setCities(nomesCidades);
    setCitiesFix(nomesCidades);
    setLocalizacaoSetada2(true)
  }

  useEffect(() => {
    axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => {

        updateStates(res.data)
      })
  }, [])

  useEffect(() => {
    axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/distritos")
      .then((res) => {
        console.log(res.data)
        updateCities(res.data)
        setLocalizacaoSetada2(true)
      })
  }, [])

  useEffect(() => {
    if (localizacaoSetada) {
      if (props.search == "state") {
        if (searchText == '') {
          setStates(statesFix);
        } else {
          const filteredStates = states.filter(state => {
            const stateNameLowerCase = state.nome.toLowerCase();
            const searchTextLowerCase = searchText.toLowerCase();

            return stateNameLowerCase.includes(searchTextLowerCase);
          });
          setStates(
            filteredStates
          )
        }
      } else {
        if (searchText == '') {
          setCities(citiesFix);
        } else {
          const filteredCities = cities.filter(city => {
            const cityNameLowerCase = city.nome.toLowerCase();
            const searchTextLowerCase = searchText.toLowerCase();

            return cityNameLowerCase.includes(searchTextLowerCase);
          });
          setCities(
            filteredCities
          )
        }
      }
    }

  }, [searchText])

  // const handleOrderClick = () => {
  //   let newList = [...results];

  //   newList.sort((a, b) => {
  //     (a.name > b.name) ? 1 : (b.name > a.name) ? -1 : 0
  //   })

  //   setList(newList)
  // }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchArea}>
        <TextInput
          style={styles.input}
          placeholder={`Your ${props.search}`}
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={(t) => setSearchText(t)}
        />
        {/* <TouchableOpacity onPress={handleOrderClick} style={styles.orderButton}>
          <Text>+</Text>
        </TouchableOpacity> */}
      </View>

      <FlatList
        data={props.search == "state" ? states : cities}
        style={styles.list}
        initialNumToRender={100}
        maxToRenderPerBatch={100}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <StatusBar style="light" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: 'whitesmoke',
    margin: 30,
    borderRadius: 5,
    fontSize: 19,
    paddingLeft: 15,
    paddingRight: 15,
    color: 'black',
  },
  searchArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderButton: {
    width: 32,
    marginRight: 30,
  },
  list: {
    flex: 1,
  },
});