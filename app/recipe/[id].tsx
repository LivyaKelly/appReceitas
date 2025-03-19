import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Image,
  Text,
  ActivityIndicator,
  TextInput,
  Button,
  Alert,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import {
  Recipe,
  getRecipeById,
  updateRecipe,
  getLocalRecipeById,
  removeRecipe,
  addFavorite,
  getFavorites,
  removeFavorite,
} from '../../utils/api';
export default function RecipeDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipe() {
      console.log("ID recebido:", id);
      const localData = await getLocalRecipeById(id);
      if (localData) {
        console.log("Receita local encontrada:", localData);
        setRecipe(localData);
        setIsLocal(true);
      } else {
        const apiData = await getRecipeById(id);
        console.log("Receita da API:", apiData);
        if (apiData) {
          setRecipe(apiData);
          setIsLocal(false);
        } else {
          console.warn("Nenhuma receita encontrada para o ID:", id);
          setRecipe(null);
        }
      }
      checkIfFavorite(id);

      setLoading(false);
    }

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setInstructions(recipe.instructions);
      setImageUrl(recipe.imageUrl);
    }
  }, [recipe]);

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
      }
    } catch (error) {
      console.error("Erro ao capturar imagem:", error);
      Alert.alert("Erro", "Não foi possível capturar a imagem.");
    }
  };

  const handleSave = async () => {
    if (!recipe) return;
    const updatedRecipe: Recipe = {
      ...recipe,
      name: name.trim() === '' ? recipe.name : name,
      instructions: instructions.trim() === '' ? recipe.instructions : instructions,
      imageUrl: imageUrl.trim() === '' ? recipe.imageUrl : imageUrl,
    };
    try {
      await updateRecipe(updatedRecipe);
      setRecipe(updatedRecipe);
      setIsEditing(false);
      Alert.alert("Sucesso", "Receita atualizada!");
    } catch (error) {
      console.error("Erro ao salvar a receita:", error);
      Alert.alert("Erro", "Não foi possível atualizar a receita.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Excluir Receita",
      "Deseja realmente excluir essa receita?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await removeRecipe(recipe!.id);
              Alert.alert("Sucesso", "Receita removida!");
              router.back();
            } catch (error) {
              console.error("Erro ao deletar receita:", error);
              Alert.alert("Erro", "Não foi possível excluir a receita.");
            }
          }
        }
      ]
    );
  };

  const checkIfFavorite = async (recipeId: string) => {
    const favorites = await getFavorites();
    setIsFavorite(favorites.some(fav => fav.id === recipeId));
  };

  const handleFavoriteToggle = async () => {
    if (!recipe) return;
    if (isFavorite) {
      await removeFavorite(recipe.id);
    } else {
      await addFavorite(recipe);
    }
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFoundText}>Receita não encontrada.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <TouchableOpacity onPress={handleFavoriteToggle} style={styles.favoriteButton}>
          <FontAwesome name={isFavorite ? "star" : "star-o"} size={30} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.detailContainer}>
          {isEditing ? (
            <>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome da Receita" />
              <TextInput style={[styles.input, { height: 100 }]} value={instructions} onChangeText={setInstructions} multiline placeholder="Modo de Preparo" />
              <Button title="Salvar" onPress={handleSave} />
              <Button title="Cancelar" onPress={() => setIsEditing(false)} color="gray" />
            </>
          ) : (
            <>
              <Text style={styles.title}>{recipe.name}</Text>
              <Text style={styles.instructions}>{recipe.instructions}</Text>
            </>
          )}
        </View>
        <View style={styles.buttonRow}>
          {isLocal && !isEditing && (
            <Button title="Editar" onPress={() => setIsEditing(true)} />
          )}
          {isLocal && (
            <Button title="Deletar" onPress={handleDelete} color="red" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F3F3' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  image: { width: '100%', height: 250 },
  detailContainer: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  instructions: { fontSize: 16 },
  input: { backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 },
  favoriteButton: { position: 'absolute', top: 20, right: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 16 },
});
