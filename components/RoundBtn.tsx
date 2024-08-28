import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';



type RoundBtnProps = {
    icon: typeof Ionicons.defaultProps;
    text: string;
    onPress?: () => void;
};

const RoundBtn = ({ icon, text, onPress }: RoundBtnProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.circle}>
                <Ionicons name={icon} size={30} color={Colors.dark} />
            </View>
            <Text style={styles.label}>{text}</Text>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 10,
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.dark,
    },
});
export default RoundBtn;