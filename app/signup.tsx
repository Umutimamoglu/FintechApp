import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';

const signup = () => {


    const [countryCode, setCountyrCode] = useState('+90')
    const [phoneNumber, setPhonenumber] = useState('')
    const keyboradVErticalOffset = Platform.OS === 'ios' ? 80 : 0;
    const router = useRouter();
    const { signUp } = useSignUp()

    const onSignUp = async () => {
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;


        try {
            await signUp!.create({
                phoneNumber: fullPhoneNumber,
            });
            signUp!.preparePhoneNumberVerification();
            router.push({
                pathname: '/verify/[phone]',
                params: { phone: encodeURIComponent(fullPhoneNumber) },
            } as any);

        } catch (error) {
            console.error('Error signing up:', error);
        }
    };



    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={keyboradVErticalOffset} >


            <View style={{ flex: 1 }}>
                <Text> Let's get started!</Text>
                <Text style={defaultStyles.descriptionText}>
                    Enter your phone number. We will sen you a confirmation code there
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputContainer}
                        placeholder="Country code"
                        placeholderTextColor={Colors.gray}
                        value={countryCode}
                    />
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="mobil number"
                        keyboardType="numeric"
                        value={phoneNumber}
                        onChangeText={setPhonenumber}
                    />

                </View>
                <Link href={'/login'} replace>

                    <TouchableOpacity>
                        <Text style={defaultStyles.textLink}>Already have an account? Log in </Text>
                    </TouchableOpacity>

                </Link>

                <View style={{ flex: 1 }} />

                <TouchableOpacity style={[defaultStyles.pillButton,
                phoneNumber !== '' ? styles.enabled : styles.disable,
                { marginBottom: 40 }]}

                    onPress={onSignUp} >
                    <Text style={defaultStyles.buttonText} >Sign up</Text>
                </TouchableOpacity>


            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 20,
        flexDirection: 'row'
    },
    input: {
        backgroundColor: Colors.lightGray,
        padding: 10,
        borderRadius: 16,
        fontSize: 15,
        marginRight: 10,

    },
    enabled: {
        backgroundColor: Colors.primary
    },
    disable: {
        backgroundColor: Colors.primaryMuted
    }

})

export default signup