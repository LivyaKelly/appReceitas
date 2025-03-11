import { View, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import RecipeCard from '../components/recipeCard';
import { getFavorites, Recipe, removeFavorite } from '../api';


export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const data = await getFavorites();
    setFavorites(data);
  };

  const handleDelete = async (recipeId: string) => {
    Alert.alert(
      'Remover Favorito',
      'Tem certeza que deseja remover essa receita dos favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim', onPress: async () => {
            await removeFavorite(recipeId);
            fetchFavorites();
          }
        }
      ]
    );
  };


  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f3f3f3' }}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <RecipeCard recipe={item} onPress={() => {}} />
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={{ backgroundColor: 'red', padding: 8, borderRadius: 5, marginTop: 5 }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>Remover dos Favoritos</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );

}
