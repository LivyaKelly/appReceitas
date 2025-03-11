import { Stack } from 'expo-router';
import BottomNavBar from '../components/bottonNavBar';

export default function Layout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomNavBar />
    </>
  );
  
}
