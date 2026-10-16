import React, { useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { trackScreen } from '../services/analytics';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import ExpenseFormScreen from '../screens/ExpenseFormScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const navRef = createNavigationContainerRef();

export default function AppNavigator() {
  const { user, initializing } = useAuth();
  const routeName = useRef(null);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const onStateChange = () => {
    const current = navRef.getCurrentRoute()?.name;
    if (current && current !== routeName.current) {
      routeName.current = current;
      trackScreen(current);
    }
  };

  return (
    <NavigationContainer ref={navRef} onStateChange={onStateChange}>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Expenses" component={ExpensesScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="ExpenseForm"
              component={ExpenseFormScreen}
              options={({ route }) => ({
                title: route.params?.expense ? 'Editar gasto' : 'Novo gasto',
              })}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: '' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
