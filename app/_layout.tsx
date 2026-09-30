import '../global.css';

import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Minhas Séries' }}
      />

      <Stack.Screen
        name="form"
        options={{ title: 'Cadastrar Série' }}
      />

      <Stack.Screen
        name="detalhe"
        options={{ title: 'Detalhes da Série' }}
      />
    </Stack>
  );
}