import { useCallback, useState } from 'react';
import {
  View, Text, TouchableOpacity, Alert} from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as serieRepository from '../src/database/serieRepository';
import { Serie } from '../src/types/serie';
export default function Detalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const serieId = Number(id);
  const [serie, setSerie] = useState<Serie | null>(null);
  async function carregarSerie() {
    const resultado = await serieRepository.getSerieById(serieId);
    setSerie(resultado);
  }
  useFocusEffect(
    useCallback(() => {carregarSerie();
    }, [id])
  );

  if (serie === null) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-4">
        <Text className="text-gray-500">
          Série não encontrada.
        </Text>
      </View>
    );
  }

  async function alternarConclusao() {
    await serieRepository.toggleSerieConcluida(serieId);
    await carregarSerie();
  }
  //manda o id pra tela do form para editar a serie
  function editar() {
    router.push(`/form?id=${serieId}`);
  }

  function confirmarExclusao() {
    Alert.alert(
      'Excluir série',
      'Tem certeza que deseja excluir esta série?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await serieRepository.deleteSerie(serieId);
            router.back();
          },
        },
      ]
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        {serie.titulo}
      </Text>

      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="text-gray-700 mb-2">
          <Text className="font-bold">Plataforma: </Text>
          {serie.plataforma}
        </Text>

        <Text className="text-gray-700 mb-2">
          <Text className="font-bold">Temporadas: </Text>
          {serie.temporadas}
        </Text>

        <Text className="text-gray-700 mb-2">
          <Text className="font-bold">Nota: </Text>
          {serie.nota !== null ? serie.nota : 'Sem nota'}
        </Text>

        <Text className="text-gray-700">
          <Text className="font-bold">Status: </Text>
          {serie.concluida === 1 ? 'Concluída' : 'Assistindo'}
        </Text>
      </View>

      <TouchableOpacity
        className="bg-pink-400 p-4 rounded-lg mb-3"
        onPress={alternarConclusao}
      >
        <Text className="text-white text-center font-bold">
          {serie.concluida === 1
            ? 'Voltar para assistindo'
            : 'Marcar como concluída'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-gray-300 p-4 rounded-lg mb-3"
        onPress={editar}
      >
        <Text className="text-gray-800 text-center font-bold">
          Editar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-red-400 p-4 rounded-lg"
        onPress={confirmarExclusao}
      >
        <Text className="text-white text-center font-bold">
          Excluir
        </Text>
      </TouchableOpacity>
    </View>
  );
}