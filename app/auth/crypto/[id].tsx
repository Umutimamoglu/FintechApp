import { View, Text, SectionList, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useHeaderHeight } from '@react-navigation/elements';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Item } from 'zeego/dropdown-menu';
const categories = ['Overview', 'News', 'Orders', 'Transactions'];
import { CartesianChart, Line } from "victory-native";
import { Ticker } from '@/interfaces/crypro';
import { useFont } from '@shopify/react-native-skia';


const DATA = Array.from({ length: 31 }, (_, i) => ({
    day: i,
    highTmp: 40 + 30 * Math.random(),
}));

const Page = () => {
    const { id } = useLocalSearchParams();
    const headerHeight = useHeaderHeight();
    const [activeIndex, setActiveIndex] = useState(0);
    const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 12);

    const { data } = useQuery({
        queryKey: ['info', id],
        queryFn: async () => {
            const info = await fetch(`/api/info?ids=${id}`).then((res) => res.json());
            return info[+id];
        },
    });

    /*const { data: tickers } = useQuery({
        queryKey: ['tickers'],
        queryFn: async (): Promise<any[]> => {
            return await fetch(`/api/tickers`).then((res) => res.json());
        }
    });

    uyumsuz ikinci back ned epi den veir cekekmdiği için
*/
    return (
        <>
            <Stack.Screen options={{ title: data?.name }} />
            <SectionList
                style={{ paddingTop: headerHeight }}
                contentInsetAdjustmentBehavior="automatic"
                keyExtractor={(item) => item.title}
                sections={[{ title: 'Overview', data: [{ title: 'Chart' }] }]}
                renderSectionHeader={() => (
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollViewContainer}
                    >
                        {categories.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setActiveIndex(index)}
                                style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
                            >
                                <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
                ListHeaderComponent={() => (
                    <>
                        <View style={styles.headerContainer}>
                            <Text style={styles.subtitle}>{data?.symbol}</Text>
                            <Image source={{ uri: data?.logo }} style={styles.logo} />
                        </View>

                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={[defaultStyles.pillButtonSmall, styles.buyButton]}>
                                <Ionicons name="add" size={24} color="#fff" />
                                <Text style={[defaultStyles.buttonText, styles.buttonTextWhite]}>Buy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[defaultStyles.pillButtonSmall, styles.receiveButton]}>
                                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                                <Text style={[defaultStyles.buttonText, { color: Colors.primary }]}>Receive</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
                renderItem={() => (
                    <>
                        <View style={[defaultStyles.block, { height: 500 }]}>
                            <View style={[defaultStyles.block, { height: 500 }]}>

                                <CartesianChart
                                    axisOptions={{
                                        font,
                                    }}
                                    data={DATA}
                                    xKey="day"
                                    yKeys={["highTmp"]}
                                >
                                    {({ points }) => (
                                        <Line points={points.highTmp} color="red" strokeWidth={3} />
                                    )}
                                </CartesianChart>
                            </View>
                        </View>
                        <View style={defaultStyles.block}>
                            <Text style={styles.subtitle}>Overview</Text>
                            <Text style={styles.description}>
                                Bitcoin is a decentralized digital currency, without a central bank or single
                                administrator, that can be sent from user to user on the peer-to-peer bitcoin
                                network without the need for intermediaries. Transactions are verified by network
                                nodes through cryptography and recorded in a public distributed ledger called a
                                blockchain.
                            </Text>
                        </View>
                    </>
                )}
            />
        </>
    );
};

const styles = StyleSheet.create({
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.gray,
    },
    categoryText: {
        fontSize: 14,
        color: Colors.gray,
    },
    categoryTextActive: {
        fontSize: 14,
        color: '#000',
    },
    categoriesBtn: {
        padding: 10,
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    categoriesBtnActive: {
        padding: 10,
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    scrollViewContainer: {
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 8,
        backgroundColor: Colors.background,
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
    },
    logo: {
        width: 60,
        height: 60,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        margin: 12,
    },
    buyButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        gap: 16,
    },
    receiveButton: {
        backgroundColor: Colors.primaryMuted,
        flexDirection: 'row',
        gap: 16,
    },
    buttonTextWhite: {
        color: '#fff',
    },
    chartContainer: {
        height: 500,
    },
    description: {
        color: Colors.gray,
    },
});

export default Page;