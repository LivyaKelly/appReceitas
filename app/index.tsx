import { SafeAreaView, FlatList, ActivityIndicator, Text, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import RecipeCard from '../components/recipeCard';
import { getRecipes, Recipe, addFavorite } from '../api';


export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchRecipes() {
      const data = await getRecipes();
      setRecipes(data);
      setLoading(false);
    }
    fetchRecipes();
  }, []);

  const handleAddFavorite = async (recipe: Recipe) => {
    await addFavorite(recipe);
    alert('Receita adicionada aos favoritos!');
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    );
  }


  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: '#f3f3f3' }}>
      <FlatList
        data={recipes}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <RecipeCard recipe={item} onPress={() => {}} />
            <TouchableOpacity
              onPress={() => handleAddFavorite(item)}
              style={{ backgroundColor: '#4CAF50', padding: 8, borderRadius: 5, marginTop: 5 }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>Adicionar aos Favoritos</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );

}
