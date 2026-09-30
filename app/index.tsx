import { useCallback, useState } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import { useFocusEffect, router } from 'expo-router';

import * as serieRepository from '../src/database/serieRepository';
import { Serie, SerieFilter } from '../src/types/serie';

export default function Home() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [filtro, setFiltro] = useState<SerieFilter>('todas');

  async function carregar() {
    const resultado = await serieRepository.getSeries(filtro);
    setSeries(resultado);
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [filtro])
  );

  function mudarFiltro(novoFiltro: SerieFilter) {
    setFiltro(novoFiltro);
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">

      //filtros 
      <View className="flex-row gap-2 mb-4">
        <TouchableOpacity
          className={`flex-1 p-3 rounded-lg ${
            filtro === 'todas' ? 'bg-pink-300' : 'bg-gray-200'
          }`}
          onPress={() => mudarFiltro('todas')}
        >
          <Text
            className={`text-center font-bold ${
              filtro === 'todas' ? 'text-white' : 'text-gray-700'
            }`}
          > Todas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 p-3 rounded-lg ${
            filtro === 'assistindo' ? 'bg-pink-300' : 'bg-gray-200'
          }`}
          onPress={() => mudarFiltro('assistindo')}
        >
          <Text
            className={`text-center font-bold ${
              filtro === 'assistindo' ? 'text-white' : 'text-gray-700'
            }`}
          > Assistindo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 p-3 rounded-lg ${
            filtro === 'concluidas' ? 'bg-pink-300' : 'bg-gray-200'
          }`}
          onPress={() => mudarFiltro('concluidas')}
        >
          <Text
            className={`text-center font-bold ${
              filtro === 'concluidas' ? 'text-white' : 'text-gray-700'
            }`}
          > Concluídas
          </Text>
        </TouchableOpacity>
      </View>

      //lista de séries
      <FlatList
        data={series}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`p-4 rounded-lg mb-2 ${
              item.concluida === 1 ? 'bg-gray-200' : 'bg-white'
            }`}
            onPress={() => router.push(`/detalhe?id=${item.id}`)}
          >
            <Text className="text-lg font-bold text-gray-800">
              {item.titulo}
            </Text>

            <Text className="text-gray-600 mt-1">
              {item.plataforma}
            </Text>

            <Text className="text-gray-600 mt-1">
              {item.temporadas} temporada
              {item.temporadas !== 1 ? 's' : ''}
            </Text>

            <Text className="text-gray-600 mt-1">
              {item.nota !== null ? `Nota: ${item.nota}` : 'Sem nota'}
            </Text>

            <Text className="text-xs text-gray-400 mt-2">
              {item.concluida === 1 ? 'Concluída' : 'Assistindo'}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 mt-8">
            Nenhuma série encontrada.
          </Text>
        }
      />

      //botao nova serie
      <TouchableOpacity
        className="bg-pink-400 p-4 rounded-lg mt-4"
        onPress={() => router.push('/form')}
      >
        <Text className="text-white text-center font-bold">
          + Nova série
        </Text>
      </TouchableOpacity>
    </View>
  );
}