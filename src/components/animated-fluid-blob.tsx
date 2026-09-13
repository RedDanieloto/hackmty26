import React, { useEffect } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function AnimatedFluidBlob() {
  // Blob 1 (Primary Hunter Green morphing blob)
  const b1TranslateX = useSharedValue(0);
  const b1TranslateY = useSharedValue(0);
  const b1ScaleX = useSharedValue(1);
  const b1ScaleY = useSharedValue(1);
  const b1Rotate = useSharedValue(0);
  const b1Opacity = useSharedValue(0.7);

  // Blob 2 (Secondary lighter green / soft forest glow)
  const b2TranslateX = useSharedValue(25);
  const b2TranslateY = useSharedValue(-20);
  const b2ScaleX = useSharedValue(0.9);
  const b2ScaleY = useSharedValue(1.15);
  const b2Rotate = useSharedValue(45);
  const b2Opacity = useSharedValue(0.6);

  // Blob 3 (Tertiary warm Sand Dune core droplet)
  const b3TranslateX = useSharedValue(-20);
  const b3TranslateY = useSharedValue(25);
  const b3Scale = useSharedValue(1);
  const b3Opacity = useSharedValue(0.45);

  useEffect(() => {
    // --- Blob 1 Animations (Smooth Organic Liquid Morph) ---
    b1TranslateX.value = withRepeat(
      withSequence(
        withTiming(45, { duration: 4200, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) }),
        withTiming(-35, { duration: 5100, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) }),
        withTiming(20, { duration: 4600, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) }),
        withTiming(0, { duration: 3800, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) })
      ),
      -1,
      true
    );

    b1TranslateY.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 4800, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) }),
        withTiming(30, { duration: 4300, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) }),
        withTiming(-20, { duration: 5200, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) }),
        withTiming(0, { duration: 4100, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) })
      ),
      -1,
      true
    );

    // Asymmetric scaling creates the organic "liquid squash and stretch"
    b1ScaleX.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 3600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.85, { duration: 4200, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.2, { duration: 3900, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    b1ScaleY.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 3600, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.35, { duration: 4200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.9, { duration: 3900, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    b1Rotate.value = withRepeat(
      withSequence(
        withTiming(40, { duration: 7000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-30, { duration: 7500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    b1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 3400, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.5, { duration: 4200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // --- Blob 2 Animations (Counter-motion & Light Forest Vibrancy) ---
    b2TranslateX.value = withRepeat(
      withSequence(
        withTiming(-50, { duration: 5300, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) }),
        withTiming(40, { duration: 4700, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) }),
        withTiming(20, { duration: 4000, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) })
      ),
      -1,
      true
    );

    b2TranslateY.value = withRepeat(
      withSequence(
        withTiming(35, { duration: 4400, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) }),
        withTiming(-45, { duration: 5200, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) }),
        withTiming(-15, { duration: 3800, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95) })
      ),
      -1,
      true
    );

    b2ScaleX.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 4000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.3, { duration: 3800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.95, { duration: 4200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    b2ScaleY.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 4000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.8, { duration: 3800, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.15, { duration: 4200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    b2Rotate.value = withRepeat(
      withSequence(
        withTiming(-45, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
        withTiming(40, { duration: 8500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // --- Blob 3 Animations (Gentle Sand Dune Warmth Pulse) ---
    b3TranslateX.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 6000 }),
        withTiming(-35, { duration: 5500 })
      ),
      -1,
      true
    );

    b3TranslateY.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 5800 }),
        withTiming(35, { duration: 6200 })
      ),
      -1,
      true
    );

    b3Scale.value = withRepeat(
      withSequence(
        withTiming(1.25, { duration: 4500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.85, { duration: 4800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const b1Style = useAnimatedStyle(() => ({
    opacity: b1Opacity.value,
    transform: [
      { translateX: b1TranslateX.value },
      { translateY: b1TranslateY.value },
      { scaleX: b1ScaleX.value },
      { scaleY: b1ScaleY.value },
      { rotate: `${b1Rotate.value}deg` },
    ],
  }));

  const b2Style = useAnimatedStyle(() => ({
    opacity: b2Opacity.value,
    transform: [
      { translateX: b2TranslateX.value },
      { translateY: b2TranslateY.value },
      { scaleX: b2ScaleX.value },
      { scaleY: b2ScaleY.value },
      { rotate: `${b2Rotate.value}deg` },
    ],
  }));

  const b3Style = useAnimatedStyle(() => ({
    opacity: b3Opacity.value,
    transform: [
      { translateX: b3TranslateX.value },
      { translateY: b3TranslateY.value },
      { scale: b3Scale.value },
    ],
  }));

  return (
    <View style={[styles.container, { pointerEvents: 'none' }]}>
      {/* Blob 1: Native Gaussian-blurred Hunter Green droplet */}
      <Animated.View style={[styles.blobWrapper, styles.blob1, b1Style]}>
        <Image
          source={require('@/assets/images/radial-blob-green.png')}
          style={styles.fillImage}
          contentFit="fill"
        />
      </Animated.View>

      {/* Blob 2: Native Gaussian-blurred Vibrant Forest Green droplet */}
      <Animated.View style={[styles.blobWrapper, styles.blob2, b2Style]}>
        <Image
          source={require('@/assets/images/radial-blob-light.png')}
          style={styles.fillImage}
          contentFit="fill"
        />
      </Animated.View>

      {/* Blob 3: Native Gaussian-blurred Sand Dune glowing core */}
      <Animated.View style={[styles.blobWrapper, styles.blob3, b3Style]}>
        <Image
          source={require('@/assets/images/radial-blob-sand.png')}
          style={styles.fillImage}
          contentFit="fill"
        />
      </Animated.View>
    </View>
  );
}

const BLOB_BASE_SIZE = Math.min(SCREEN_WIDTH * 1.25, 520);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 0,
    paddingTop: SCREEN_HEIGHT * 0.04,
  },
  blobWrapper: {
    position: 'absolute',
    ...Platform.select({
      web: {
        filter: 'blur(35px)',
        WebkitFilter: 'blur(35px)',
        willChange: 'transform',
      },
      default: {},
    }),
  },
  fillImage: {
    width: '100%',
    height: '100%',
  },
  blob1: {
    width: BLOB_BASE_SIZE * 1.15,
    height: BLOB_BASE_SIZE * 1.05,
  },
  blob2: {
    width: BLOB_BASE_SIZE * 0.95,
    height: BLOB_BASE_SIZE * 1.0,
  },
  blob3: {
    width: BLOB_BASE_SIZE * 0.8,
    height: BLOB_BASE_SIZE * 0.8,
  },
});
