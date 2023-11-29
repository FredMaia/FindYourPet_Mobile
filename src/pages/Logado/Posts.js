import React, { useState, useEffect, useContext } from "react";

import {
    ActivityIndicator,
    TextInput,
    Text,
    Alert,
    Modal,
    View,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Keyboard,
} from "react-native"

import { AuthContext } from "../../contexts/auth";

import axios from "axios";
import Axios from "../../services/Axios.js"
import {LOCAL_IP} from "@env"

import * as ImagePicker from 'expo-image-picker';

import mime from "mime"
import moment from "moment"
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default () => {
    const { user, setUser } = useContext(AuthContext);

    const [posts, setPosts] = useState();
    const [postsSearch, setPostsSearch] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [description, setDescription] = useState("");
    const [petName, setPetName] = useState("");
    const [uploadedPhoto, setUploadedPhoto] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState();
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    
    const baseURL = `http://${LOCAL_IP}:3001/`

    useEffect(() => {
        Axios.get("/auth/profile/adm", {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
            .then(res => {
                console.log("eh adm")
                setUser((prevObject) => {
                    return {
                        ...prevObject,
                        isAdm: true,
                    };
                });
            })
            .catch((err) => {
                console.log("nao é adm.")
                setUser((prevObject) => {
                    return {
                        ...prevObject,
                        isAdm: false,
                    };
                });
            })
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, [postsSearch]);


    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (user) {
            Axios.get("/posts")
                .then(res => {
                    const response = res.data;
                    if (user.isAdm) {
                        setPosts(res.data)
                        setPostsSearch(res.data)
                    } else {
                        const filteredPosts = response.filter((post) => post.state == user.state && post.city)
                        setPosts(filteredPosts)
                        setPostsSearch(filteredPosts)
                    }
                })
                .catch((err) => {
                    console.log("erro ao puxar posts", err)
                })
        }
    }, [user])

    useEffect(() => {
        if (searchText == '') {
            setPostsSearch(posts);
        } else {
            const filteredStates = posts.filter(post => {
                const postDescriptionLowerCase = post.description.toLowerCase();
                const searchTextLowerCase = searchText.toLowerCase();

                return postDescriptionLowerCase.includes(searchTextLowerCase);
            });
            setPostsSearch(
                filteredStates
            )
        }
    }, [searchText])

    const uploadProfilePhoto = async (id) => {
        const formData = new FormData();
        const newImageUri = "file:///" + profilePhoto.split("file:/").join("");
        formData.append('featuredImage', {
            // name: new Date() + "_profile",
            uri: profilePhoto,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop()
        });

        try {
            const res = await Axios.post(`/posts/featured-image/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            }).then(res => {
                Axios.get("/posts")
                    .then(res => {
                        const response = res.data;
                        const filteredPosts = response.filter((post) => post.state == user.state && post.city)
                        setPosts(filteredPosts)
                    })
                    .catch((err) => {
                        console.log("erro ao puxar posts", err)
                    })
            })
        } catch (err) {
            console.log(err);
        }
    }

    const openImageLibrary = async () => {
        // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // const { status } = ImagePicker.useMediaLibraryPermissions();

        // if (status !== 'granted') {
        //     alert('Sorry, we need camera roll permissions to make this work!');
        // }

        // if (status === 'granted') {
        const response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            allowsEditing: true,
        });
        if (!response.canceled) {
            setProfilePhoto(response.assets[0].uri);
            setUploadedPhoto(true)
        }
        // }
    };

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

    const createPost = () => {
        console.log("imagem do user" + user.img)
        if (uploadedPhoto) {
            if (description && petName) {
                console.log(user.number);
                Axios.post("/posts",
                    {
                        description: description,
                        username: user.username,
                        city: user.city,
                        state: user.state,
                        userPhoto: user.img,
                        petName: petName,
                        userNumber: user.number
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${user.token}`
                        }
                    }).then(res => {
                        console.log(res.data._id)
                        uploadProfilePhoto(res.data._id)
                        Alert.alert("Post criado com sucesso")
                    })
                    .catch((err) => {
                        console.log("erro ao criar post", err)
                    })
                setUploadedPhoto(false)
            } else {
                Alert.alert("Please, set a description and your pet name.")
            }
        } else {
            Alert.alert("Please, upload a photo of your pet to create a post.")
        }
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
                    const filteredPosts = response.filter((post) => post.state == user.state && post.city)
                    setPosts(filteredPosts)
                })
                .catch((err) => {
                    console.log("Erro ao puxar posts", err)
                })
        })
    }

    const refreshPosts = () => {
        setRefresh(true);

        Axios.get("/posts")
            .then(res => {
                const response = res.data;
                console.log(user)
                if (user.isAdm) {
                    setPosts(res.data)
                    setPostsSearch(res.data)
                } else {
                    const filteredPosts = response.filter((post) => post.state == user.state && post.city)
                    setPosts(filteredPosts)
                    setPostsSearch(filteredPosts)
                }
                setRefresh(false);
            })
            .catch((err) => {
                console.log("Erro ao puxar posts", err)
            })
    }

    const addSavedPets = (img, petName, postId) => {
        console.log(petName)
        Axios.post("/pets/saved", {
            petOwner: user.username,
            petImage: img,
            petName: petName
        }).then(res => {
            Alert.alert("Pet atualizado!")
            console.log("Id do post a ser excluído: ")
            console.log(postId)
            deletePost(postId);
        }).catch(err => {
            console.error("Nao foi possivel adicionar o pet", err);
        })

    }

    return (
        <View style={styles.feed}>
            <View>
                <Modal
                    transparent
                    visible={modalVisible}
                    onRequestClose={() => { setModalVisible(false) }}
                    animationType="fade"
                >
                    <View style={styles.outerView}>
                        <View style={keyboardVisible ? styles.modalViewWithKeyboard : styles.modalView}>
                            <Text style={styles.title}>Crie seu post</Text>
                            <TextInput
                                placeholder="Description"
                                style={styles.descriptionInput}
                                multiline={true}
                                onChangeText={text => setDescription(text)}
                                numberOfLines={4}
                            />

                            <TextInput
                                placeholder="Tell us the pet name"
                                style={styles.descriptionInput}
                                multiline={true}
                                onChangeText={text => setPetName(text)}
                                numberOfLines={1}
                            />

                            <TouchableOpacity style={{
                                backgroundColor: "#1793a6",
                                padding: 15,
                                marginTop: 15,
                                width: '70%',
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 8,
                            }} onPress={openImageLibrary}>
                                <Text style={{ color: "white" }}> Upload photo</Text>
                            </TouchableOpacity>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity onPress={createPost}>
                                    <Text style={styles.modalClose}>Create post</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={styles.modalClose}>Close modal</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={styles.searchAndInput}>
                    <TextInput
                        placeholder="Search for a post"
                        style={styles.searchInput}
                        onChangeText={(text) => setSearchText(text)}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={() => setModalVisible(true)}>
                        <Text style={{ color: 'white' }}>Create post</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading == true ? (
                <View>
                    <ActivityIndicator
                        color="#1793a6"
                    />
                </View>
            )
                :
                <FlatList
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={() => refreshPosts()}
                        />
                    }
                    data={postsSearch}
                    keyExtractor={(item) => item.slug}
                    renderItem={({ item }) => (
                        <View style={styles.container}>
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

                                <View>
                                    {item.username === user.username || user.isAdm ?
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: "center", marginTop: 30 }}>
                                            <TouchableOpacity style={styles.button} onPress={() => deletePost(item.id)}>
                                                <FontAwesome name="trash-o" size={24} color="white" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.button} onPress={() => addSavedPets(item.featuredImage, item.petName, item.id)}>
                                                <Text style={{ color: 'white' }}>FOUND IT!</Text>
                                            </TouchableOpacity>

                                        </View>
                                        :
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", marginTop: 30 }}>
                                            <TouchableOpacity style={styles.button} onPress={() => Alert.alert(item.username + "'s number is " + item.userNumber)}>
                                                <Feather name="phone-call" size={24} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                            </View>
                        </View>
                    )}
                />
            }

        </View>
    )
}


const styles = StyleSheet.create({
    feed: {
        marginHorizontal: 16
    },
    container: {
        flexDirection: "row",
        padding: 8,
        borderRadius: 8,
        marginVertical: 8,
        backgroundColor: "white",
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
        aspectRatio: 4 / 3,
        width: "100%",
        // height: 250,
        borderRadius: 5,
        marginVertical: 16,
    },
    button: {
        backgroundColor: "#1793a6",
        padding: 10,
        width: '40%',
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
    outerView: {
        flex: 1,
        justifyContent: 'center',
        marginTop: "10%",
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,0.2)"
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 35,
        width: '90%',
        height: '60%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalViewWithKeyboard: {
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 35,
        width: '90%',
        height: '95%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    searchAndInput: {
        flexDirection: 'row',
        width: '100%'
    },
    searchInput: {
        width: '60%',
        paddingLeft: 10
    },
    searchButton: {
        backgroundColor: "#1793a6",
        padding: 20,
        width: '40%',
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    descriptionInput: {
        marginTop: 20,
        width: '100%',
        backgroundColor: 'whitesmoke',
        borderRadius: 4,
        padding: 10,
        textAlign: 'left',
        textAlignVertical: 'top',
    },
    modalButtons: {
        flex: 1,
        flexDirection: 'row',
        width: "100%",
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    }
})