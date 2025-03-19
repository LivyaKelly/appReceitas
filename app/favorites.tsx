import { View, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { getFavorites, Recipe, removeFavorite } from '../utils/api';
import RecipeCard from '../components/recipeCard';

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
    <View style={{ flex: 1, padding: 16, paddingHorizontal: 8, backgroundColor: '#f3f3f3' }}>
      <View>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 40 }}>Favoritos</Text>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20 }}
        renderItem={({ item }) => (
          <View style={{ width: '48%', backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', paddingBottom: 10 }}>
            <RecipeCard recipe={item} onPress={() => {}} />
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={{
                backgroundColor: 'red',
                padding: 8,
                borderRadius: 5,
                width: '90%',
                alignSelf: 'center',
                marginTop: 10,
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>Remover dos Favoritos</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
