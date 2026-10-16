# Walletly

App mobile (React Native + Expo) de controle de gastos pessoais.

- Login / cadastro (Firebase Auth) com sessão persistente (JWT)
- CRUD de gastos no Firestore, vinculado à conta: `users/{uid}/expenses/{id}`
- Firebase Analytics (eventos: `login`, `sign_up`, `logout`, `expense_created`, `expense_updated`, `expense_deleted` + telas)
- Firebase Remote Config (feature toggles: `show_monthly_summary`, `show_category_filter`)

> Usa `@react-native-firebase`, que é código nativo: **não roda no Expo Go**. Use o build do EAS (APK).

## 1. Configurar o Firebase (console)
1. Authentication → Sign-in method → ativar **E-mail/senha**.
2. Firestore Database → criar banco → aba Regras → colar o conteúdo de `firestore.rules` → Publicar.
3. Project settings → app Android `com.walletly.app` → baixar `google-services.json` e colocar **na raiz do projeto**.
4. Remote Config → criar 2 parâmetros do tipo **Boolean**: `show_monthly_summary` e `show_category_filter` (valor `true`) → Publicar.
   Para testar o toggle: mude um para `false`, publique e reabra o app.

## 2. Instalar
```
npm install
npx expo install --fix
```

## 3. Gerar o APK
```
npm i -g eas-cli
eas login
eas init
eas build --platform android --profile preview
```
Ao final o EAS mostra o link/QR code para baixar o `.apk`.

## Estrutura
```
src/
  context/AuthContext.js      sessão, login, cadastro, logout, JWT
  hooks/useExpenses.js        CRUD + listagem em tempo real (Firestore)
  hooks/useFeatureFlags.js    Remote Config
  services/analytics.js       eventos do Analytics
  services/remoteConfig.js    defaults + fetch dos toggles
  screens/                    Login, Register, Expenses, ExpenseForm
  navigation/AppNavigator.js  rotas (logado / deslogado) + screen_view
```
