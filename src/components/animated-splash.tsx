import React, { createContext, useContext, useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedFluidBlob } from './animated-fluid-blob';
import { BrandColors } from '@/constants/theme';

interface SplashContextType {
  replaySplash: () => void;
  isSplashVisible: boolean;
}

const SplashContext = createContext<SplashContextType>({
  replaySplash: () => {},
  isSplashVisible: false,
});

export const useSplash = () => useContext(SplashContext);

interface AnimatedSplashProps {
  children?: React.ReactNode;
  autoHideDuration?: number;
  onAnimationFinish?: () => void;
}

// Individual animated sound wave bar for the voice frequency visualizer
function VoiceWaveBar({
  delay,
  baseHeight,
  peakHeight,
  color,
}: {
  delay: number;
  baseHeight: number;
  peakHeight: number;
  color: string;
}) {
  const heightAnim = useSharedValue(baseHeight);
  const opacityAnim = useSharedValue(0.6);

  useEffect(() => {
    heightAnim.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(peakHeight, { duration: 340 + delay, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          withTiming(baseHeight * 0.7, { duration: 280 + delay, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          withTiming(peakHeight * 0.85, { duration: 380, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          withTiming(baseHeight, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
        ),
        -1,
        true
      )
    );

    opacityAnim.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 320 }),
          withTiming(0.65, { duration: 320 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
    opacity: opacityAnim.value,
  }));

  return (
    <Animated.View
      style={[
        styles.waveBar,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

export function AnimatedSplashProvider({
  children,
  autoHideDuration = 2600,
  onAnimationFinish,
}: AnimatedSplashProps) {
  const [visible, setVisible] = useState(true);
  const [playId, setPlayId] = useState(1);
  const insets = useSafeAreaInsets();

  // Animation shared values
  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);

  // Icon & pulse rings
  const iconScale = useSharedValue(0.5);
  const iconOpacity = useSharedValue(0);

  const ring1Scale = useSharedValue(0.8);
  const ring1Opacity = useSharedValue(0);
  const ring2Scale = useSharedValue(0.7);
  const ring2Opacity = useSharedValue(0);

  // Soundwave cluster
  const waveOpacity = useSharedValue(0);
  const waveScale = useSharedValue(0.8);

  // Title & tagline
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(18);

  // Powered by section
  const footerOpacity = useSharedValue(0);
  const footerTranslateY = useSharedValue(16);

  const finishSplash = () => {
    setVisible(false);
    onAnimationFinish?.();
  };

  const replaySplash = () => {
    setVisible(true);
    setPlayId((id) => id + 1);
  };

  useEffect(() => {
    if (!visible) return;

    // Reset values for replay
    containerOpacity.value = 1;
    containerScale.value = 1;

    iconScale.value = 0.5;
    iconOpacity.value = 0;

    ring1Scale.value = 0.8;
    ring1Opacity.value = 0;
    ring2Scale.value = 0.7;
    ring2Opacity.value = 0;

    waveOpacity.value = 0;
    waveScale.value = 0.8;

    titleOpacity.value = 0;
    titleTranslateY.value = 18;

    footerOpacity.value = 0;
    footerTranslateY.value = 16;

    // Hide native splash screen once React Native animated overlay is active
    if (Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => {});
    }

    // 1. Icon entrance
    iconScale.value = withSpring(1, {
      damping: 12,
      stiffness: 110,
    });
    iconOpacity.value = withTiming(1, { duration: 500 });

    // 2. Concentric biometric pulse rings in Sand Dune
    ring1Scale.value = withDelay(
      200,
      withRepeat(
        withSequence(
          withTiming(1.35, { duration: 1600, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 0 })
        ),
        -1,
        false
      )
    );
    ring1Opacity.value = withDelay(
      200,
      withRepeat(
        withSequence(
          withTiming(0.45, { duration: 300 }),
          withTiming(0, { duration: 1300, easing: Easing.out(Easing.ease) })
        ),
        -1,
        false
      )
    );

    ring2Scale.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1.5, { duration: 1600, easing: Easing.out(Easing.ease) }),
          withTiming(0.9, { duration: 0 })
        ),
        -1,
        false
      )
    );
    ring2Opacity.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(0.35, { duration: 300 }),
          withTiming(0, { duration: 1300, easing: Easing.out(Easing.ease) })
        ),
        -1,
        false
      )
    );

    // 3. Soundwaves entrance
    waveOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    waveScale.value = withDelay(300, withSpring(1, { damping: 14 }));

    // 4. Title entrance
    titleOpacity.value = withDelay(450, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(
      450,
      withSpring(0, { damping: 14, stiffness: 90 })
    );

    // 5. Footer "powered by altur" entrance
    footerOpacity.value = withDelay(650, withTiming(1, { duration: 600 }));
    footerTranslateY.value = withDelay(
      650,
      withSpring(0, { damping: 14, stiffness: 90 })
    );

    // 6. Smooth exit transition to reveal the app
    const exitTimer = setTimeout(() => {
      containerOpacity.value = withTiming(0, {
        duration: 450,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }, (finished) => {
        if (finished) {
          runOnJS(finishSplash)();
        }
      });
      containerScale.value = withTiming(1.04, {
        duration: 450,
        easing: Easing.out(Easing.quad),
      });
    }, autoHideDuration);

    return () => clearTimeout(exitTimer);
  }, [playId, visible]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const animatedRing1Style = useAnimatedStyle(() => ({
    opacity: ring1Opacity.value,
    transform: [{ scale: ring1Scale.value }],
  }));

  const animatedRing2Style = useAnimatedStyle(() => ({
    opacity: ring2Opacity.value,
    transform: [{ scale: ring2Scale.value }],
  }));

  const animatedWaveStyle = useAnimatedStyle(() => ({
    opacity: waveOpacity.value,
    transform: [{ scale: waveScale.value }],
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const animatedFooterStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
    transform: [{ translateY: footerTranslateY.value }],
  }));

  return (
    <SplashContext.Provider value={{ replaySplash, isSplashVisible: visible }}>
      {children}
      {visible && (
        <Animated.View
          pointerEvents={visible ? 'auto' : 'none'}
          style={[styles.overlay, animatedContainerStyle]}>
          {/* Dynamic Animated Organic Liquid Aura Blob */}
          <AnimatedFluidBlob />

          {/* Central Content */}
          <View style={styles.centerContent}>
            {/* Concentric Biometric Pulse Rings in Sand Dune */}
            <View style={styles.iconWrapper}>
              <Animated.View style={[styles.pulseRing, styles.ringOuter, animatedRing2Style]} />
              <Animated.View style={[styles.pulseRing, styles.ringInner, animatedRing1Style]} />

              {/* Central Voice Biometric Shield Icon */}
              <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
                <Image
                  source={require('@/assets/images/voice-auth-icon.png')}
                  style={styles.voiceIcon}
                  contentFit="cover"
                  transition={200}
                />
              </Animated.View>
            </View>

            {/* Voice Frequency Soundwave Bars in Sand Dune */}
            <Animated.View style={[styles.soundwaveRow, animatedWaveStyle]}>
              <VoiceWaveBar delay={0} baseHeight={12} peakHeight={28} color={BrandColors.sandDune} />
              <VoiceWaveBar delay={80} baseHeight={18} peakHeight={38} color={BrandColors.sandDuneLight} />
              <VoiceWaveBar delay={160} baseHeight={24} peakHeight={46} color={BrandColors.sandDune} />
              <VoiceWaveBar delay={240} baseHeight={18} peakHeight={40} color={BrandColors.sandDuneLight} />
              <VoiceWaveBar delay={120} baseHeight={26} peakHeight={48} color={BrandColors.sandDune} />
              <VoiceWaveBar delay={200} baseHeight={16} peakHeight={34} color={BrandColors.sandDuneLight} />
              <VoiceWaveBar delay={40} baseHeight={10} peakHeight={24} color={BrandColors.sandDune} />
            </Animated.View>
          </View>

          {/* Bottom "powered by altur" Footer with Sand Dune Altur Logo */}
          <Animated.View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 24) },
              animatedFooterStyle,
            ]}>
            <Text style={styles.poweredByText}>powered by</Text>
            <View style={styles.logoWrapper}>
              <Image
                source={require('@/assets/images/altur-logo-sand.png')}
                style={styles.alturLogo}
                contentFit="contain"
                transition={200}
              />
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </SplashContext.Provider>
  );
}

// Standalone overlay export for direct usage
export function AnimatedSplashOverlay(props: AnimatedSplashProps) {
  return <AnimatedSplashProvider {...props} />;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: BrandColors.hunterGreenDark, // #28412D deep hunter green
    zIndex: 99999,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  iconWrapper: {
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1.5,
  },
  ringInner: {
    width: 140,
    height: 140,
    borderColor: BrandColors.sandDune,
    backgroundColor: 'rgba(221, 214, 185, 0.08)',
  },
  ringOuter: {
    width: 165,
    height: 165,
    borderColor: BrandColors.sandDune,
    backgroundColor: 'rgba(221, 214, 185, 0.04)',
  },
  iconContainer: {
    width: 114,
    height: 114,
    borderRadius: 100,
    backgroundColor: BrandColors.hunterGreenDeep,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 6px 16px rgba(221, 214, 185, 0.25)',
      },
      default: {
        shadowColor: BrandColors.sandDune,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
      },
    }),
    elevation: 10,
    // borderWidth: 1.5,
    borderColor: 'rgba(221, 214, 185, 0.35)',
    overflow: 'hidden',
  },
  voiceIcon: {
    width: '100%',
    height: '100%',
  },
  soundwaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    gap: 6,
    marginVertical: 14,
  },
  waveBar: {
    width: 4.5,
    borderRadius: 4,
  },
  titleGroup: {
    alignItems: 'center',
    marginTop: 6,
  },
  appTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: BrandColors.sandDuneLight,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(221, 214, 185, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BrandColors.sandDune,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: BrandColors.sandDune,
    letterSpacing: 1.2,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  poweredByText: {
    fontSize: 12,
    fontWeight: '500',
    color: BrandColors.sandDuneMuted,
    letterSpacing: 1.5,
    textTransform: 'lowercase',
    marginBottom: 8,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    width: 140,
  },
  alturLogo: {
    width: 130,
    height: 34,
  },
});
