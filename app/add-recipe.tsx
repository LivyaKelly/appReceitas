import { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { saveRecipe, Recipe } from '../api';
import { useRouter } from 'expo-router';
import uuid from 'react-native-uuid';


export default function AddRecipeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSave = async () => {
    if (!name || !instructions) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const newRecipe: Recipe = {
      id: uuid.v4().toString(),
      name,
      instructions,
      imageUrl: imageUrl || 'https://via.placeholder.com/150'
    };

    await saveRecipe(newRecipe);
    Alert.alert('Sucesso', 'Receita cadastrada!');
    setName('');
    setInstructions('');
    setImageUrl('');
    router.push('/');
  };



  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f3f3f3' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Cadastrar Receita</Text>
      <TextInput
        style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5, marginBottom: 10 }}
        placeholder="Nome da Receita"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={{
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: 5,
          marginBottom: 10,
          height: 100,
          textAlignVertical: 'top'
        }}
        placeholder="Instruções"
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />
      <TextInput
        style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5, marginBottom: 10 }}
        placeholder="URL da Imagem (opcional)"
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      <Button title="Salvar Receita" onPress={handleSave} />
    </View>
  );

}
