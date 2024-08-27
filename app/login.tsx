import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';




enum SignInType {
    Phone,
    Email,
    Google,
    Apple,
}

const Page = () => {


    const [countryCode, setCountyrCode] = useState('+49')
    const [phoneNumber, setPhoneNumber] = useState('')
    const keyboradVErticalOffset = Platform.OS === 'ios' ? 90 : 0;
    const router = useRouter();
    const { signIn } = useSignIn();

    const onSignIn = async (type: SignInType) => {
        if (type == SignInType.Phone) {
            try {
                const fullPhoneNumber = `${countryCode}${phoneNumber}`;

                const { supportedFirstFactors } = await signIn!.create({
                    identifier: fullPhoneNumber,
                });
                const firstPhoneFactor: any = supportedFirstFactors?.find((factor: any) => {
                    return factor.strategy === 'phone_code'
                });
                const { phoneNumberId } = firstPhoneFactor;

                await signIn!.prepareFirstFactor({
                    strategy: 'phone_code',
                    phoneNumberId
                });

                router.push({
                    pathname: '/verify/[phone]' as any,
                    params: { phone: fullPhoneNumber, signin: 'true' },
                });
            } catch (err) {
                console.log('error', JSON.stringify(err, null, 2));
                if (isClerkAPIResponseError(err)) {
                    if (err.errors[0].code === 'form_,dentifier_not_found') {
                        Alert.alert('Error', err.errors[0].message)
                    }
                }
            }
        }
    };



    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={keyboradVErticalOffset} >


            <View style={{ flex: 1 }}>
                <Text> Welcome Back!</Text>
                <Text style={defaultStyles.descriptionText}>
                    Enter your phone number associated with your account
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Country code"
                        placeholderTextColor={Colors.gray}
                        value={countryCode}
                    />
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Mobile number"
                        placeholderTextColor={Colors.gray}
                        keyboardType="numeric"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>



                <TouchableOpacity style={[defaultStyles.pillButton,
                phoneNumber !== '' ? styles.enabled : styles.disabled,
                { marginBottom: 40, marginHorizontal: 20 }]}

                    onPress={() => onSignIn(SignInType.Phone)} >
                    <Text style={defaultStyles.buttonText} >Countinue</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16 }}>
                    <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray }} />
                    <Text style={{ color: Colors.gray, marginHorizontal: 8 }}>or</Text>
                    <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray }} />
                </View>

                <TouchableOpacity onPress={() => onSignIn(SignInType.Email)} style={[defaultStyles.pillButton, {
                    flexDirection: 'row',
                    gap: 16,
                    marginTop: 20,
                    backgroundColor: '#fff',
                    marginHorizontal: 20
                }]}>
                    <Ionicons name="mail" size={24} color={'#000'} />
                    <Text style={[defaultStyles.buttonText, { color: '#000' }]}> Countine with email</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onSignIn(SignInType.Google)} style={[defaultStyles.pillButton, {
                    flexDirection: 'row',
                    gap: 16,
                    marginTop: 20,
                    backgroundColor: '#fff',
                    marginHorizontal: 20
                }]}>
                    <Ionicons name="logo-google" size={24} color={'#000'} />
                    <Text style={[defaultStyles.buttonText, { color: '#000' }]}> Countine with email</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onSignIn(SignInType.Apple)} style={[defaultStyles.pillButton, {
                    flexDirection: 'row',
                    gap: 16,
                    marginTop: 20,
                    backgroundColor: '#fff',
                    marginHorizontal: 20
                }]}>
                    <Ionicons name="logo-apple" size={24} color={'#000'} />
                    <Text style={[defaultStyles.buttonText, { color: '#000' }]}> Countine with email</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 40,
        flexDirection: 'row',
        marginHorizontal: 20
    },
    input: {
        backgroundColor: Colors.lightGray,
        padding: 20,
        borderRadius: 16,
        fontSize: 20,
        marginRight: 10,

    },
    enabled: {
        backgroundColor: Colors.primary,
    },
    disabled: {
        backgroundColor: Colors.primaryMuted,
    },
})

export default Page;