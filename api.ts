import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Recipe {
  id: string;
  name: string;
  instructions: string;
  imageUrl: string;
}

const RECIPES_KEY = 'recipes';
const FAVORITES_KEY = 'favorites';


export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const recipes = await AsyncStorage.getItem(RECIPES_KEY);
    return recipes ? JSON.parse(recipes) : [];
  } catch (error) {
    console.error("Erro ao carregar receitas", error);
    return [];
  }
  
};



export const saveRecipe = async (recipe: Recipe): Promise<void> => {
  try {
    const recipes = await getRecipes();
    recipes.push(recipe);
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error("Erro ao salvar receita", error);
  }

};



export const getFavorites = async (): Promise<Recipe[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Erro ao carregar favoritos", error);
    return [];
  }

};



export const addFavorite = async (recipe: Recipe): Promise<void> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.find(item => item.id === recipe.id)) {
      favorites.push(recipe);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error("Erro ao adicionar favorito", error);
  }

};



export const removeFavorite = async (recipeId: string): Promise<void> => {
  try {
    let favorites = await getFavorites();
    favorites = favorites.filter(recipe => recipe.id !== recipeId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Erro ao remover favorito", error);
  }

};

// falta implementar a função de apagar a receita