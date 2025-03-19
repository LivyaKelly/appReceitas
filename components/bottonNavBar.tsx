import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';


export default function BottomNavBar() {
  const router = useRouter();


  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#f3f3f3',
      marginBottom: 15,
      paddingVertical: 15,
      borderTopWidth: 1,
      borderColor: '#ccc',
      bottom: 0,
      width: '100%',
    }}>
      <TouchableOpacity onPress={() => router.push('/')} style={{ alignItems: 'center' }}>
        <FontAwesome5 name="home" size={24} color="black" />
        <Text style={{ fontSize: 12 }}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/favorites')} style={{ alignItems: 'center' }}>
        <FontAwesome5 name="star" size={24} color="black" />
        <Text style={{ fontSize: 12 }}>Favoritos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/add-recipe')} style={{ alignItems: 'center' }}>
        <FontAwesome5 name="plus" size={24} color="black" />
        <Text style={{ fontSize: 12 }}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );

}
