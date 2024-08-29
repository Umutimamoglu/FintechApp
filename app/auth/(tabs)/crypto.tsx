import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Currency } from '@/interfaces/crypro'
import { Link } from 'expo-router'
import { useHeaderHeight } from '@react-navigation/elements';
import { ScrollView } from 'react-native-gesture-handler'
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { Ionicons } from '@expo/vector-icons'

const Page = () => {
    const headerHeight = useHeaderHeight();

    const currencies = useQuery({
        queryKey: ['currencies'],
        queryFn: () => fetch('/api/listings').then((res) => res.json())
    })

    const ids = currencies.data?.map((currency: Currency) => currency.id).join(',')

    console.log("idlerrrr : ", ids)

    const { data } = useQuery({
        queryKey: ['info', ids],
        queryFn: async () => {
            if (ids) {
                const info = await fetch(`/api/info?ids=${ids}`).then((res) => res.json());
                return info;
            }
            return undefined;
        },
        enabled: !!ids
    });

    return (
        <ScrollView
            style={{ backgroundColor: Colors.background }}
            contentContainerStyle={{ paddingTop: headerHeight }}>
            <Text style={defaultStyles.sectionHeader}>Latest Crypot</Text>
            <View style={defaultStyles.block}>
                {currencies.data?.map((currency: Currency) => (
                    <Link href={`auth/crypto/${currency.id}`} key={currency.id} asChild>
                        <TouchableOpacity style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                            <Image source={{ uri: data?.[currency.id].logo }} style={{ width: 40, height: 40 }} />
                            <View style={{ flex: 1, gap: 6 }}>
                                <Text style={{ fontWeight: '600', color: Colors.dark }}>{currency.name}</Text>
                                <Text style={{ color: Colors.gray }}>{currency.symbol}</Text>
                            </View>
                            <View style={{ gap: 6, alignItems: 'flex-end' }}>
                                <Text>{currency.quote.EUR.price.toFixed(2)} €</Text>
                                <View style={{ flexDirection: 'row', gap: 4 }}>
                                    <Ionicons
                                        name={currency.quote.EUR.percent_change_1h > 0 ? 'caret-up' : 'caret-down'}
                                        size={16}
                                        color={currency.quote.EUR.percent_change_1h > 0 ? 'green' : 'red'}
                                    />
                                    <Text
                                        style={{ color: currency.quote.EUR.percent_change_1h > 0 ? 'green' : 'red' }}>
                                        {currency.quote.EUR.percent_change_1h.toFixed(2)} %
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Link>
                ))}
            </View>
        </ScrollView>
    )
}

export default Page




/**
 * 
 *  href={`/auth/crypto/${currency.id.toString()}` as any}
 * 
 */