import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

import { registerUser, loginUser } from '~/utils/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleFirebaseError = (err: any) => {
    let errorMessage = '';

    switch (err.code) {
      case 'auth/invalid-email':
        errorMessage = 'O endereço de e-mail fornecido não é válido.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Este usuário foi desativado.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Não encontramos um usuário com esse e-mail.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'A senha fornecida está incorreta.';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Este e-mail já está em uso. Tente outro.';
        break;
      case 'auth/weak-password':
        errorMessage = 'A senha precisa ter pelo menos 6 caracteres.';
        break;
      case 'auth/missing-email':
        errorMessage = 'Preencha o campo de email para continuar.';
        break;
      case 'auth/missing-password':
        errorMessage = 'Preencha o campo de senha para continuar.';
        break;
      default:
        errorMessage = err.code;
        break;
    }

    setError(errorMessage);
  };

  const handleRegister = async () => {
    try {
      setError('');
      const user = await registerUser(email, password);
      alert(`Usuário registrado: ${user.email}`);
    } catch (err) {
      handleFirebaseError(err);
    }
  };

  const handleLogin = async () => {
    try {
      setError('');
      const user = await loginUser(email, password);
      alert(`Bem-vindo de volta, ${user.email}!`);
    } catch (err) {
      handleFirebaseError(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.inglify}>Inglify</Text>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonsContainer}>
        <Button title="Registrar" onPress={handleRegister} />
        <Button title="Entrar" onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  inglify: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  buttonsContainer: {
    gap: 16,
  },
});
