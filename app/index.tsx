// app/index.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import RecipeCard from '../components/recipeCard';
import { getRecipesApi, Recipe, addFavorite, getRecipes } from '../utils/api';

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRecipes = async () => {
    try {
      const apiRecipes = await getRecipesApi();
      setRecipes(apiRecipes);
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const apiRecipes = await getRecipesApi();
        const localRecipes = await getRecipes(); // Recupera as receitas salvas localmente
        const combinedRecipes = [...apiRecipes, ...localRecipes];
        setRecipes(combinedRecipes);
      } catch (error) {
        console.error("Erro ao buscar receitas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  // Agrupa receitas por categoria (tipo). Se não houver, agrupa em "OUTROS"
  const groupedRecipes = recipes.reduce((acc: Record<string, Recipe[]>, recipe) => {
    const category = recipe.tipo ? recipe.tipo.toUpperCase() : 'OUTROS';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(recipe);
    return acc;
  }, {});

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3D00" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.totalText}>Total de receitas: {recipes.length}</Text>
        {Object.keys(groupedRecipes).map((category) => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <FlatList
              data={groupedRecipes[category]}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() =>
                    router.push({ pathname: '/recipe/[id]', params: { id: item.id } })
                  }
                >
                  <RecipeCard
                    recipe={item}
                  />
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  scrollView: {
    paddingHorizontal: 10,

  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  cardContainer: {
    marginRight: 16,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
  },
});
