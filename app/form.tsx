import { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as serieRepository from '../src/database/serieRepository';
export default function Form() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const editando = id !== undefined;
    const [titulo, setTitulo] = useState('');
    const [plataforma, setPlataforma] = useState('');
    const [temporadas, setTemporadas] = useState('');
    const [nota, setNota] = useState<number | null>(null);

    useEffect(() => {
        async function carregarSerie() {
            if (!editando) {
                return;
            }

            const serieId = Number(id);
            const serie = await serieRepository.getSerieById(serieId);

            if (serie === null) {
                Alert.alert('Erro', 'Série não encontrada.');
                router.back();
                return;
            }
            setTitulo(serie.titulo);
            setPlataforma(serie.plataforma);
            setTemporadas(String(serie.temporadas));
            setNota(serie.nota);
        }

        carregarSerie();
    }, [id, editando]);

    function selecionarNota(valor: number) {
        if (nota === valor) {
            setNota(null);
        } else {
            setNota(valor);
        }
    }

    async function salvar() {
        const tituloLimpo = titulo.trim();
        const plataformaLimpa = plataforma.trim();
        const temporadasNumero = Number(temporadas);

        if (tituloLimpo === '') {
            Alert.alert('Atenção', 'Informe o título da série.');
            return;
        }

        if (plataformaLimpa === '') {
            Alert.alert('Atenção', 'Informe a plataforma.');
            return;
        }

        if (
            temporadas.trim() === '' ||
            !Number.isInteger(temporadasNumero) ||
            temporadasNumero < 0
        ) {
            Alert.alert(
                'Atenção',
                'Temporadas deve ser um número inteiro >=0.'
            );
            return;
        }

        const dados = {
            titulo: tituloLimpo,
            plataforma: plataformaLimpa,
            temporadas: temporadasNumero,
            nota,
        };

        if (editando) {
            await serieRepository.updateSerie(Number(id), dados);
        } else {
            await serieRepository.createSerie(dados);
        }

        router.back();
    }

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            <Text className="text-2xl font-bold text-gray-800 mb-6">
                {editando ? 'Editar série' : 'Nova série'}
            </Text>

            <Text className="text-gray-700 font-bold mb-2">
                Título
            </Text>

            <TextInput
                className="bg-white border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="Nome da série"
                value={titulo}
                onChangeText={setTitulo}
            />

            <Text className="text-gray-700 font-bold mb-2">
                Plataforma
            </Text>

            <TextInput
                className="bg-white border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="Ex.: Netflix, Max, Prime Video"
                value={plataforma}
                onChangeText={setPlataforma}
            />

            <Text className="text-gray-700 font-bold mb-2">
                Temporadas
            </Text>

            <TextInput
                className="bg-white border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="Qtde. de temporadas"
                value={temporadas}
                onChangeText={setTemporadas}
                keyboardType="numeric"
            />

            <Text className="text-gray-700 font-bold mb-2">
                Nota
            </Text>

            <View className="flex-row justify-between mb-6">
                {[1, 2, 3, 4, 5].map((valor) => (
                    <TouchableOpacity
                        key={valor} className={`w-12 h-12 rounded-lg items-center justify-center ${nota === valor ? 'bg-pink-400' : 'bg-gray-200'
                            }`}
                        onPress={() => selecionarNota(valor)}>
                        <Text className={`text-base font-bold text-center ${nota === valor ? 'text-white' : 'text-gray-600'}`}>
                            {valor} ★
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                className="bg-pink-400 p-4 rounded-lg"
                onPress={salvar} >
                <Text className="text-white text-center font-bold">
                    {editando ? 'Salvar alterações' : 'Cadastrar série'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}