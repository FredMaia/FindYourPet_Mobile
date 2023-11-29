import React, { useContext, useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList, Alert, RefreshControl } from "react-native"

import { AuthContext } from "../../contexts/auth";

import * as ImagePicker from 'expo-image-picker';

import axios from "axios";
import Axios from "../../services/Axios.js"
import {LOCAL_IP} from "@env"

import mime from "mime"
import moment from "moment"
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default () => {
    const { user, setFotoUsuario, fotoUsuario, setLogado } = useContext(AuthContext);

    const [profilePhoto, setProfilePhoto] = useState("");
    const [userPosts, setUserPosts] = useState();
    const [refresh, setRefresh] = useState(false);

    const baseURL = `http://${LOCAL_IP}:3001/`

    const openImageLibrary = async () => {
        // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        // if (status !== 'granted') {
        //     alert('Sorry, we need camera roll permissions to make this work!');
        // }

        // if (status === 'granted') {
        const response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
        });
        if (!response.canceled) {
            setProfilePhoto(response.assets[0].uri);
            uploadProfilePhoto();
        }
        // }
    };

    const updateAsyncData = async () => {
        console.log(user.img)
        try {
            await AsyncStorage.setItem("zuserCache", JSON.stringify(user));
        } catch (error) {
            console.error('Error updating data: ', error);
        }
    };

    const uploadProfilePhoto = async () => {
        const formData = new FormData();
        const newImageUri = "file:///" + profilePhoto.split("file:/").join("");
        formData.append('featuredImage', {
            // name: new Date() + "_profile",
            uri: profilePhoto,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop()
        });

        try {
            const res = await Axios.post(`/auth/featured-image/${user.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            })

            setFotoUsuario(res.data.user.userProfilePhoto)
            user.img = res.data.user.userProfilePhoto;
            updateAsyncData();

            console.log("imagem atualizada com sucesso");
        } catch (err) {
            console.log(err);
            Alert.alert("Error, try to upload the photo again")
        }
    }

    const getPostTime = (time) => {
        var ano = '', mes = '', dia = '', hora = '', min = '';
        for (var i = 0; i < time.length; i++) {
            if (i < 4 && time[i] != '-') {
                ano += time[i];
            } else if (i < 7 && time[i] != '-') {
                mes += time[i];
            } else if (i < 10 && time[i] != '-') {
                dia += time[i];
            } else if (i < 13 && time[i] != '-' && time[i] != 'T') {
                hora += time[i];
            } else if (i < 16 && time[i] != '-' && time[i] != ':' && time[i] != 'T') {
                min += time[i];
            }
        }

        const data = dia + "/" + mes + "/" + ano + ", " + hora + ":" + min;
        return data;
    }

    useEffect(() => {
        if (user) {
            Axios.get("/posts")
                .then(res => {
                    const response = res.data;
                    const filteredPosts = response.filter((post) => post.username == user.username)
                    setUserPosts(filteredPosts)
                })
                .catch((err) => {
                    console.log("erro ao puxar posts", err)
                })
        }
    }, [user])

    const showToast = () => {
        console.log("clicked")
        Toast.show({
            type: "success",
            text1: "You clicked into the button",
            text1: "You clicked into the button",
            autoHide: false,
            position: "bottom"
        })
    }

    const deletePost = (id) => {
        Axios.delete(`/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }).then(res => {
            Alert.alert(res.data)
            Axios.get("/posts")
                .then(res => {
                    const response = res.data;
                    const filteredPosts = response.filter((post) => post.username == user.username)
                    setUserPosts(filteredPosts)
                })
                .catch((err) => {
                    console.log("Erro ao puxar posts", err)
                })
        })
    }

    const addSavedPets = (img, petName, postId) => {
        console.log(img)
        console.log(petName)
        console.log(postId)
        Axios.post("/pets/saved", {
            petOwner: user.username,
            petImage: img,
            petName: petName
        }).then(res => {
            Alert.alert("Pet atualizado!")
            console.log(postId)
        }).catch(err => {
            console.error("Nao foi possivel adicionar o pet", err);
        })
        deletePost(postId);
    }

    const refreshPosts = () => {
        setRefresh(true);
        Axios.get("/posts")
            .then(res => {
                const response = res.data;
                const filteredPosts = response.filter((post) => post.username == user.username)
                setUserPosts(filteredPosts)
                setRefresh(false);
            })
            .catch((err) => {
                console.log("Erro ao puxar posts", err)
            })
    }

    return (

        <View style={styles.container}>

            <FlatList
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => refreshPosts()}
                    />
                }
                data={userPosts}
                style={{ flex: 1 }}
                keyExtractor={(item) => item.slug}
                ListHeaderComponent={() => (
                    <View>
                        <View style={{ padding: 20, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 30, padding: 30 }}>{user.username}'s profile</Text>

                            {!user.img ?
                                <Image
                                    source={{ uri: baseURL + "uploads/profileImages/unknownuser.png" }}
                                    style={styles.profileImage}
                                /> :
                                user.img && !fotoUsuario ? <Image
                                    source={{ uri: baseURL + user.img }}
                                    style={styles.profileImage}
                                /> : <Image
                                    source={{ uri: baseURL + fotoUsuario }}
                                    style={styles.profileImage}
                                />
                            }

                            <TouchableOpacity
                                onPress={openImageLibrary}
                                style={styles.uploadProfilePhoto}
                            >
                                <Text>Update profile photo</Text>
                                {profilePhoto && <Text>Imagem selecionada</Text>}
                            </TouchableOpacity>

                        </View>

                        <View style={{ alignItems: "center" }}>
                            <Text>E-mail: {user.email}</Text>
                            <Text>Place: {user.city}, {user.state}</Text>
                            <Text>Phone number: {user.number}</Text>

                            <View style={{ justifyContent: "flex-end", alignItems: "center", padding: 30, marginBottom: 20 }}>
                                <TouchableOpacity style={styles.button} onPress={() => {
                                    AsyncStorage.removeItem("token");
                                    setLogado(false)
                                    console.log("deslogado")
                                }}>
                                    <Text style={{ color: 'white' }}>Logout</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={{ fontWeight: "bold", padding: 20 }}>Your posts</Text>
                        </View>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={styles.container2}>
                        {item.userPhoto ?
                            <Image style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }} source={{ uri: baseURL + item.userPhoto }} />
                            :
                            <Image style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }} source={{ uri: baseURL + "uploads/profileImages/unknownuser.png" }} />
                        }
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 50, flexDirection: "row", backgroundColor: "white", alignItems: "center" }}>
                                <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.username}</Text>
                                <Text style={{ marginLeft: 10, marginTop: 5, fontSize: 10, fontWeight: "light", justifyContent: "center" }}>{moment(item.createdAt).fromNow()}</Text>
                            </View>

                            <Text style={styles.cardText}>{item.description}</Text>

                            <Image style={styles.cardImage} source={{ uri: baseURL + item.featuredImage }} resizeMode="cover" />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: "center", marginTop: 30 }}>
                                <TouchableOpacity style={styles.button} onPress={() => deletePost(item.id)}>
                                    <FontAwesome name="trash-o" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={() => addSavedPets(item.featuredImage, item.petName, item.id)}>
                                    <Text style={{ color: 'white' }}>FOUND IT!</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container2: {
        flex: 1,
        flexDirection: "row",
        padding: 8,
        borderRadius: 8,
        marginVertical: 8,
        backgroundColor: "white",
    },
    uploadProfilePhoto: {
        height: 40,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    button: {
        width: 100,
        height: 40,
        backgroundColor: "#1793a6",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
    },
    cardText: {
        fontSize: 16,
        marginTop: 16,
    },
    cardImage: {
        flex: 1,
        width: "100%",
        height: 250,
        borderRadius: 5,
        marginVertical: 16,
    },
})