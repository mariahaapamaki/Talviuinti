import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'

const Error = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {props.message}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        alignItems: 'center',
        margin: 10
    },
    text: {
        color: 'red'
    }

})

export default Error