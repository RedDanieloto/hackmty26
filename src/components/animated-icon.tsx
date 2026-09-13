import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';

export {
  AnimatedSplashOverlay,
  AnimatedSplashProvider,
  useSplash,
} from './animated-splash';

const DURATION = 500;

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: 0.8 }],
    opacity: 0,
  },
  60: {
    transform: [{ scale: 1.05 }],
    opacity: 0.9,
    easing: Easing.elastic(1.1),
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(1.1),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '0deg' }],
  },
  100: {
    transform: [{ rotateZ: '360deg' }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(20000)} style={styles.glow}>
        <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} />
      </Animated.View>

      <Animated.View style={styles.imageContainer} entering={keyframe.duration(DURATION)}>
        <Image
          style={styles.image}
          source={require('@/assets/images/voice-auth-icon.png')}
          contentFit="cover"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 120,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    width: 180,
    height: 180,
    position: 'absolute',
    opacity: 0.6,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 130,
    zIndex: 100,
  },
  image: {
    width: 120,
    height: 120,
  },
});
