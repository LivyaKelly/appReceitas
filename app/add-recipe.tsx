// app/add-recipe.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { saveRecipe, Recipe } from '../utils/api';
import { useRouter } from 'expo-router';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';

export default function AddRecipeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  const pickImageFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da permissão para acessar a câmera.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setPickedImage(uri);
        setImageUrl(uri);
        console.log("Imagem capturada:", uri);
      }
    } catch (error) {
      console.error("Erro ao capturar imagem:", error);
      Alert.alert("Erro", "Não foi possível capturar a imagem.");
    }
  };

  const handleSave = async () => {
    if (!name || !instructions) {
      Alert.alert("Erro", "Preencha os campos obrigatórios: Nome e Instruções.");
      return;
    }
    const newRecipe: Recipe = {
      id: uuid.v4().toString(),
      name,
      instructions,
      imageUrl: imageUrl || 'https://via.placeholder.com/150',
      tipo: "",
    };

    try {
      await saveRecipe(newRecipe);
      console.log("Receita cadastrada:", newRecipe);
      Alert.alert("Sucesso", "Receita cadastrada com sucesso!");
      setName('');
      setInstructions('');
      setImageUrl('');
      setPickedImage(null);
      router.push('/');
    } catch (error) {
      console.error("Erro ao cadastrar receita:", error);
      Alert.alert("Erro", "Não foi possível cadastrar a receita.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Receita</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da Receita"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Instruções"
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />
      <TouchableOpacity onPress={pickImageFromCamera} style={styles.button}>
        <Text style={styles.buttonText}>Tirar Foto</Text>
      </TouchableOpacity>
      {pickedImage && (
        <Image source={{ uri: pickedImage }} style={styles.image} />
      )}
      <Button title="Salvar Receita" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 80,
    backgroundColor: '#f3f3f3',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
});
