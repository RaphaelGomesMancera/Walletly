# Walletly

Aplicativo mobile de controle de gastos pessoais, feito em React Native com Expo. O usuário se autentica e pode registrar, visualizar, editar e excluir seus gastos (valor, categoria e data). Os dados ficam no Firestore, vinculados à conta.

## Descrição

- Login e cadastro de usuário
- Cadastro de gastos (valor, categoria e data)
- Listagem dos gastos do usuário logado
- Edição e exclusão de gastos
- Persistência de sessão (o usuário permanece logado)
- Dados em `users/{uid}/expenses/{id}`, com regras para cada usuário acessar só os próprios gastos

## Público-alvo

Jovens e estudantes que querem uma forma simples de acompanhar os gastos do dia a dia, sem depender de planilhas.

## Integrantes

Repositório: https://github.com/RaphaelGomesMancera/Walletly

- Bruno Vinicius Barbosa — RM 566366
- Guilherme de Andrade Martini — RM 566087
- Nathan Gonçalves Pereira Mendes — RM 564666
- Raphael Gomes Mancera — RM 562279

## Telas

- **Login:** e-mail, senha, botão de entrar e link para cadastro
- **Cadastro:** criação da conta
- **Gastos:** lista com valor, categoria e data, botão flutuante "+" para adicionar, e editar/excluir em cada item
- **Novo gasto / Editar:** valor, categoria, data e descrição opcional

## Feature adicional

Firebase Analytics e Remote Config (feature toggle).

- **Analytics:** eventos de login, cadastro, logout, gasto criado, editado e excluído, além da visualização de cada tela
- **Remote Config:** `show_monthly_summary` (card com o total do mês) e `show_category_filter` (filtro por categoria). Dá para ligar e desligar pelo console do Firebase sem publicar uma nova versão

## APK

Build Android (perfil `preview`):

https://expo.dev/accounts/raphaelmancera010/projects/walletly/builds/e60ce0d0-3e94-45a9-a0e0-b068c565778e

O app usa `@react-native-firebase` e não roda no Expo Go. A instalação é pelo APK.

## Configurar o Firebase

1. Authentication → Sign-in method → ativar **E-mail/senha**.
2. Firestore Database → criar banco → aba Regras → colar o conteúdo de `firestore.rules` → Publicar.
3. Project settings → app Android `com.walletly.app` → baixar `google-services.json` e colocar na raiz do projeto.
4. Remote Config → criar 2 parâmetros booleanos: `show_monthly_summary` e `show_category_filter` (valor `true`) → Publicar.

## Instalar e gerar o APK

```
npm install
npx expo install --fix
npm i -g eas-cli
eas login
eas init
eas build --platform android --profile preview
```

## Estrutura

```
src/
  context/AuthContext.js      sessão, login, cadastro, logout
  hooks/useExpenses.js        CRUD e listagem em tempo real
  hooks/useFeatureFlags.js    Remote Config
  services/analytics.js       eventos do Analytics
  services/remoteConfig.js    toggles
  screens/                    Login, Register, Expenses, ExpenseForm
  navigation/AppNavigator.js  rotas logado / deslogado
```
