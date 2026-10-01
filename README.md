# Minhas Séries

App mobile para registrar as séries que você assistiu ou está assistindo. É possível cadastrar, editar e excluir séries, marcar como concluída e filtrar a lista entre todas, assistindo e concluídas. Os dados ficam salvos em SQLite e continuam lá depois de fechar o app.

## Tecnologias

React Native, Expo, Expo Router, NativeWind, SQLite (expo-sqlite) e TypeScript, com o padrão Repository separando tela, repositório e conexão com o banco.

## Como rodar

```bash
npm install
npx expo start
```

Se o `npm install` der o erro `ERESOLVE`, use `npm install --legacy-peer-deps`.
Depois escaneie o QR code com o Expo Go (celular e PC na mesma rede Wi-Fi).

## Dependências

Todas são instaladas automaticamente com `npm install`. Principais pacotes:

- **Expo e navegação:** `expo`, `expo-router`, `expo-linking`, `expo-constants`, `expo-status-bar`, `react-native-screens`, `react-native-safe-area-context`
- **Banco de dados:** `expo-sqlite`
- **Estilo (NativeWind v4):** `nativewind`, `tailwindcss`, `react-native-reanimated`, `react-native-worklets`, `babel-preset-expo`
- **Base:** `react`, `react-native`
- **Desenvolvimento:** `typescript`, `@types/react`

## Testes - etapa 8 

Cadastrei 3 séries, concluí uma e editei outra. Depois fechei o Expo Go por completo e abri de novo: as séries e os filtros continuaram funcionando.
[Ver vídeo do teste](teste/teste.mp4)

## Diário do copiloto

### Registro 1 — Etapa 1
**O que eu pedi:** ajuda para resolver o erro "Something went wrong" no Expo Go ao abrir o projeto recém-configurado.
**O que a IA sugeriu (resumo):** rodar `npx expo install` com `expo-router`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`, `expo-linking` e `expo-constants`, achando que isso resolveria. Também sugeriu que o problema podia ser a rede (Wi-Fi 2.4 GHz no celular e cabo no PC) e que eu usasse o modo `--tunnel`.
**O que eu fiz:** corrigi. Li o erro real no terminal (`Cannot find module 'babel-preset-expo'` e depois `Cannot find module 'react-native-worklets/plugin'`) e vi que faltavam dois pacotes que a IA não tinha listado. Instalei os dois com `npx expo install`. Descartei o `--tunnel`, porque o problema não era a rede: o Metro já mostrava um IP local (`exp://192.168.0.176:8081`). Aprendi que o texto do erro no terminal vale mais do que a tela genérica do celular.

### Registro 2 — Etapa 1
**O que eu pedi:** como resolver o erro `ERESOLVE` (conflito entre `react@19.2.3` e `react-dom@19.3.0`) ao rodar `npx expo install babel-preset-expo`.
**O que a IA sugeriu (resumo):** repetir o comando passando `--legacy-peer-deps` para o npm (`npx expo install babel-preset-expo -- --legacy-peer-deps`) e criar um `.npmrc` com `legacy-peer-deps=true`, para não repetir a flag nas próximas instalações.
**O que eu fiz:** aceitei e adaptei. Rodei o comando com `--legacy-peer-deps`, porque a flag já aparecia no enunciado para o NativeWind e fazia sentido usá-la aqui também. Não criei o `.npmrc` (deixei a flag só nos comandos) e não rodei `npm audit fix --force`, porque a IA avisou que ele podia quebrar versões do SDK. Mantive as versões que o Expo escolheu.

### Registro 3 — Etapa 2
**O que eu pedi:** como resolver o erro `TS2882: Cannot find module or type declarations for side-effect import of '../global.css'`, que apareceu no `app/_layout.tsx` quando rodei `npx tsc --noEmit` pela primeira vez.
**O que a IA sugeriu (resumo):** primeiro, criar o `nativewind-env.d.ts` com `/// <reference types="nativewind/types" />`. Como eu já tinha esse arquivo com essa linha, a sugestão não resolveu. Depois sugeriu conferir se o `tsconfig.json` incluía o arquivo (o meu não tem `include`, então ele já era lido) e, por fim, acrescentar `declare module '*.css';` no mesmo arquivo.
**O que eu fiz:** corrigi. A primeira sugestão da IA estava incompleta, porque a referência do NativeWind cuida do `className`, mas não ensina o TypeScript a aceitar `import` de arquivo `.css`. Adicionei `declare module '*.css';` no `nativewind-env.d.ts`, mantendo a linha de referência, e o `npx tsc --noEmit` passou sem erros. Aprendi que o erro vinha da Etapa 1 e só apareceu na validação de tipos.

### Registro 4 — Etapa 4
**O que eu pedi:** ajuda com a função `toggleSerieConcluida(id: number)` do repositório, porque eu não tinha entendido o que ela devia fazer.
**O que a IA sugeriu (resumo):** explicou que a função serve ao botão "Marcar como concluída / voltar para assistindo" da tela de detalhe: ela inverte o valor de `concluida` (0 vira 1, 1 vira 0) para a série com aquele `id`. Sugeriu fazer isso só com SQL, em um único `UPDATE`, sem ler a série antes, e deu a dica de pensar numa conta aritmética. Reforçou que o `id` entra com `?`, sem template string.
**O que eu fiz:** adaptei. Em vez da conta aritmética, usei `CASE WHEN concluida = 0 THEN 1 ELSE 0 END`, porque achei mais fácil de ler e de explicar. O `id` entra com `?` e o `UPDATE` inverte o valor sem precisar buscar a série antes. O `tsc` passou sem erros.

### Registro 5 — Etapas 5, 6 e 7 (telas e visual)
**O que eu pedi:** ao ChatGPT, que montasse as telas (`index`, `form` e `detalhe`), os botões e o visual com NativeWind, a partir do enunciado de cada etapa.
**O que a IA sugeriu (resumo):** o código completo das três telas e do `_layout.tsx`, já chamando as funções do repositório que eu escrevi.
**O que eu fiz:** aceitei as telas e as conectei ao meu banco, aos meus tipos e ao meu repositório. Testei no celular e fiz apenas algumas alterações em posicionamentos e cores. Reconheço que as telas vieram da IA; a parte que escrevi sozinho foi o banco, os tipos e o repositório. Depois pedi explicações dos trechos que eu não tinha entendido, registradas nos próximos registros.

### Registro 6 — Etapa 5 (useFocusEffect)
**O que eu pedi:** como funciona o `useFocusEffect` que veio na tela de lista, por que ele pede um `useCallback` e por que o `useEffect(() => { carregar(); }, [])` da Aula 3 não basta para recarregar a lista quando volto do formulário.
**O que a IA sugeriu (resumo):**
1. **O problema do `useEffect` com `[]`:** o `Stack` do Expo Router mantém as telas empilhadas. Quando abro o formulário, a lista não é desmontada, só fica "embaixo". Ao voltar, ela não é montada de novo, então o `useEffect` com `[]` (que só roda na montagem) não executa outra vez e a série nova não aparece.
2. **O que o `useFocusEffect` faz:** ele roda a função sempre que a tela ganha foco, na primeira vez que abre e toda vez que volto para ela. O gatilho é o foco, não a montagem.
3. **Por que pede `useCallback`:** o hook roda o efeito de novo sempre que a função que recebe muda de identidade. Sem `useCallback`, o React cria uma função nova a cada render, o que causaria um loop: carregar → `setSeries` → novo render → função nova → o efeito roda de novo. O `useCallback` mantém a mesma função entre renders e só cria outra quando uma dependência muda.
4. **O array de dependências:** define quando o efeito roda de novo além do foco. Na lista é `[filtro]`, para recarregar também quando troco o filtro. No detalhe é `[id]`.
5. **Onde usar cada um:** `useFocusEffect` nas telas que ficam "embaixo" na pilha e precisam atualizar ao voltar (lista e detalhe). No `form` basta `useEffect`, porque o formulário é montado do zero cada vez que abre.
**O que eu fiz:** aceitei. O `useFocusEffect` já estava nas telas de lista e detalhe e passei a entender por que ele está ali: a lista e o detalhe ficam embaixo na pilha, então precisam recarregar quando ganham foco de novo.

### Registro 7 — Etapas 6 e 7 (passagem do `id` entre telas)
**O que eu pedi:** ajuda para entender como o `id` passa de uma tela para outra (`/form?id=3` e `/detalhe?id=3`), porque eu não tinha entendido como o parâmetro sai de uma tela e chega na outra.
**O que a IA sugeriu (resumo):** explicou que são duas pontas.
1. **Quem envia:** a tela de origem monta a rota com o parâmetro na URL, por exemplo ``router.push(`/detalhe?id=${item.id}`)``. O `?id=3` é um parâmetro de URL, e o `${item.id}` só monta o texto da rota. Não tem relação com a regra do `?` do SQL, que vale só para as queries do repositório.
2. **Quem recebe:** a tela de destino lê o parâmetro com o hook `useLocalSearchParams`, por exemplo `const { id } = useLocalSearchParams<{ id?: string }>()`.
3. **O `id` chega sempre como `string`**, mesmo sendo um número, e pode ser `undefined` se a tela for aberta sem parâmetro. Por isso é preciso converter com `Number(id)` antes de chamar o repositório. Esquecer isso é o erro comum do formulário de edição que abre vazio.
4. **Cadastro ou edição:** no `form`, o `id` é opcional (`id?: string`). Se existe, é edição (`editando = id !== undefined`); se não existe, é cadastro. No `detalhe`, ele é obrigatório, porque sempre vem da lista.
**O que eu fiz:** aceitei a explicação. O código das telas já fazia isso (o `form` decide `editando` pela existência do `id` e o `detalhe` converte com `Number(id)`), e agora consigo explicar o caminho completo: a lista envia o `id` pela URL, o detalhe o recebe como texto e o converte, e o botão "Editar" o reenvia para o `form`.

### Registro 8 — Etapa 7 (confirmação de exclusão)
**O que eu pedi:** ajuda para entender a função `confirmarExclusao` da tela de detalhe: um alerta que pergunta se tenho certeza antes de excluir a série e, se eu confirmar, apaga e volta para a lista.
**O que a IA sugeriu (resumo):** explicou que o `Alert.alert` recebe um título, uma mensagem e uma lista de botões. Cada botão é um objeto com `text`, um `style` e um `onPress` opcional.
- O botão **"Cancelar"** usa `style: 'cancel'` e não tem `onPress`: tocar nele só fecha o alerta, sem apagar nada.
- O botão **"Excluir"** usa `style: 'destructive'` e o seu `onPress` é `async`: primeiro `await serieRepository.deleteSerie(serieId)` e só depois `router.back()`.
- A ordem importa: esperar a exclusão terminar antes de voltar garante que, quando a lista ganhar foco e recarregar com `useFocusEffect`, a série já não está mais no banco.
**O que eu fiz:** aceitei. A função já vinha na tela de detalhe e passei a entender o fluxo: o alerta pede a confirmação, o "Cancelar" não faz nada e o "Excluir" apaga pelo repositório (`deleteSerie`, com o `id` entrando por `?` no SQL) e volta para a lista.

### Registro 9 — Etapa 7 (estado de carregamento no detalhe)
**O que eu pedi:** ao ChatGPT, que deixasse a tela de detalhe pronta e bonita seguindo os requisitos da etapa.
**O que a IA sugeriu (resumo):** o arquivo inteiro da tela. Ele usou o mesmo `if (serie === null)` para "carregando" e "não encontrada".
**O que eu fiz:** corrigi. Percebi que, ao abrir o detalhe, a tela mostrava "Série não encontrada." por um instante antes de os dados chegarem, porque `serie` começa `null` enquanto o banco responde. Acrescentei um estado `carregando` (começa `true` e vira `false` quando `carregarSerie` termina) e um `if (carregando)` antes do `if (serie === null)`, que mostra "Carregando...". Assim "Série não encontrada." só aparece quando a busca terminou e a série realmente não existe.