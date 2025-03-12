// utils/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECIPES_KEY = 'recipes';
const FAVORITES_KEY = 'favorites';
const BASE_URL = "https://api-receitas-pi.vercel.app/receitas";

export interface Recipe {
  id: string;
  name: string;
  instructions: string;
  imageUrl: string;
  tipo: string;
  ingredientes?: string;
}

// Funções de armazenamento local (AsyncStorage)
export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const recipes = await AsyncStorage.getItem(RECIPES_KEY);
    return recipes ? JSON.parse(recipes) : [];
  } catch (error) {
    console.error("Erro ao carregar receitas:", error);
    return [];
  }
};

export const saveRecipe = async (recipe: Recipe): Promise<void> => {
  try {
    const stored = await AsyncStorage.getItem(RECIPES_KEY);
    const recipes = stored ? JSON.parse(stored) : [];
    recipes.push(recipe);
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    console.log("Receita salva com sucesso:", recipe);
  } catch (error) {
    console.error("Erro ao salvar receita:", error);
  }
};

export const updateRecipe = async (updatedRecipe: Recipe): Promise<void> => {
  try {
    let recipes = await getRecipes();
    recipes = recipes.map(recipe =>
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    );
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error("Erro ao atualizar receita:", error);
  }
};

export const getLocalRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const stored = await AsyncStorage.getItem(RECIPES_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed.find((r: Recipe) => r.id === id) || null;
  } catch (error) {
    console.error("Erro ao buscar receita local por ID:", error);
    return null;
  }
};

export const removeRecipe = async (recipeId: string): Promise<void> => {
  try {
    let recipes = await getRecipes();
    recipes = recipes.filter(recipe => recipe.id !== recipeId);
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    console.log("Receita removida com sucesso:", recipeId);
  } catch (error) {
    console.error("Erro ao remover receita:", error);
  }
};

// Funções para favoritos
export const getFavorites = async (): Promise<Recipe[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
    return [];
  }
};

export const addFavorite = async (recipe: Recipe): Promise<void> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.find(item => item.id === recipe.id)) {
      favorites.push(recipe);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      console.log("Favorito adicionado:", recipe.id);
    }
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);
  }
};

export const removeFavorite = async (recipeId: string): Promise<void> => {
  try {
    let favorites = await getFavorites();
    favorites = favorites.filter(recipe => recipe.id !== recipeId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    console.log("Favorito removido:", recipeId);
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
  }
};

// Funções para consumo da API (dados reais)
export const getRecipesApi = async (): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${BASE_URL}/todas`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Resposta da API:", data);
    const recipes: Recipe[] = data.map((item: any) => ({
      id: item.id.toString(),
      name: item.receita,
      instructions: item.modo_preparo,
      imageUrl: item.link_imagem,
      tipo: item.tipo,
      ingredientes: item.ingredientes,
    }));
    return recipes;
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    return [];
  }
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    if (!text) {
      console.warn("Resposta vazia para o id:", id);
      return null;
    }
    const data = JSON.parse(text);
    const recipe: Recipe = {
      id: data.id !== undefined ? data.id.toString() : id,
      name: data.receita || 'Nome não disponível',
      instructions: data.modo_preparo || '',
      imageUrl: data.link_imagem || '',
      tipo: data.tipo || '',
      ingredientes: data.ingredientes || '',
    };
    return recipe;
  } catch (error) {
    console.error("Erro ao buscar receita por ID:", error);
    return null;
  }
};

export const getRecipesByType = async (tipo: string): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${BASE_URL}/tipo/${tipo}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const recipes: Recipe[] = data.map((item: any) => ({
      id: item.id.toString(),
      name: item.receita,
      instructions: item.modo_preparo,
      imageUrl: item.link_imagem,
      tipo: item.tipo,
      ingredientes: item.ingredientes,
    }));
    return recipes;
  } catch (error) {
    console.error("Erro ao buscar receitas por tipo:", error);
    return [];
  }
};
