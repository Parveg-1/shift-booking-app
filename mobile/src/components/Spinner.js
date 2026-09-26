import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { colors } from '../theme';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const TONES = {
  green: colors.success,
  red: colors.primary,
};

/**
 * Recreation of the spinners shipped in the assignment assets
 * (assets/spinner_green.svg, assets/spinner_red.svg), animated with
 * React Native instead of SMIL so it also runs on native.
 */
export default function Spinner({ size = 22, tone = 'green', duration = 1000 }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [duration, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <AnimatedSvg
      width={size}
      height={size}
      viewBox="0 0 38 38"
      style={{ transform: [{ rotate: spin }] }}
    >
      <G transform="translate(1 1)" stroke={TONES[tone] || tone} strokeWidth={2} fill="none">
        <Circle strokeOpacity={0.5} cx="18" cy="18" r="18" />
        <Path d="M36 18c0-9.94-8.06-18-18-18" strokeLinecap="round" />
      </G>
    </AnimatedSvg>
  );
}
