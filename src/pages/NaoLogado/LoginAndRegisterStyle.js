import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        marginBottom: 50,
        fontSize: 40,
    },
    input: {
        width: '80%',
        height: 45,
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
    buttonText: {
        fontSize: 20,
        color: '#FFF'
    },
    text: {
        width: '100%',
        marginLeft: '25%',
    },
    inputPassword: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        width: '80%'
    },
    errorMessage: {
        width: "100%", 
        marginLeft: "20%",
        color: 'red',
        fontWeight: "bold",
        marginTop: -10,
        marginBottom: 12,
    }
})

export default styles;