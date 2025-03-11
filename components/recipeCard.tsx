import { View, Text, Image, TouchableOpacity } from 'react-native';

interface Recipe {
  id: string;
  name: string;
  instructions: string;
  imageUrl: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}


export default function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: '#fff', borderRadius: 5, overflow: 'hidden' }}>
      <Image source={{ uri: recipe.imageUrl }} style={{ width: '100%', height: 200 }} />
      <View style={{ padding: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{recipe.name}</Text>
        <Text numberOfLines={2}>{recipe.instructions}</Text>
      </View>
    </TouchableOpacity>
  );
  
}
