import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Login from '../userComponents/Login'
import SignUp from '../userComponents/SignUp'
import UserProfile from '../userComponents/UserProfile'

const Stack = createStackNavigator()

const UserNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false
                }}
        />
        <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
            headerShown: false
            }}
        />
        <Stack.Screen
            name="UserProfile"
            component={UserProfile}
            options={{
            headerShown: false
            }}
        />
        </Stack.Navigator>
    )
}
export default UserNavigator
