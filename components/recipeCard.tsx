// components/RecipeCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Recipe } from '../utils/api';

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
}

export default function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {recipe.instructions}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 100,
  },
  infoContainer: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
