import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Currency } from '@/interfaces/crypro'


const Page = () => {

    const currencies = useQuery({
        queryKey: ['currencies'],
        queryFn: () => fetch('/api/listings').then((res) => res.json())
    })

    const ids = currencies.data?.map((currency: Currency) => currency.id).join(',')

    console.log("idlerrrr : ", ids)

    // Sadece ids geçerli olduğunda ikinci sorguyu çalıştır
    const { data } = useQuery({
        queryKey: ['info', ids],
        queryFn: async () => {
            if (ids) {
                const info = await fetch(`/api/info?ids=${ids}`).then((res) => res.json());
                return info;  // info[+ids] yerine info döndürülüyor
            }
            return undefined;
        },
        enabled: !!ids  // ids geçerli olduğunda sorguyu etkinleştirir
    });

    return (
        <View style={{ marginTop: 50 }}>
            {currencies.data?.map((currency: Currency) => (
                <View style={{ flexDirection: 'row' }} key={currency.id}>
                    <Image source={{ uri: data?.[currency.id]?.logo }} style={{ width: 32, height: 32 }} />
                    <Text>{currency.name}</Text>
                </View>
            ))}
        </View>
    )
}


export default Page