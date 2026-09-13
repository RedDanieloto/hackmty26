import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  Polyline,
  Line,
  Polygon,
} from 'react-native-svg';

import { BrandColors } from '@/constants/theme';

export type IconName =
  | 'settings'
  | 'shield'
  | 'shield-check'
  | 'shield-alert'
  | 'play'
  | 'logout'
  | 'check'
  | 'alert'
  | 'phone'
  | 'phone-call'
  | 'phone-off'
  | 'mic'
  | 'mic-off'
  | 'speaker'
  | 'close'
  | 'user'
  | 'ai'
  | 'refresh'
  | 'chevron-down'
  | 'chevron-right'
  | 'transfer'
  | 'bank'
  | 'wallet'
  | 'history'
  | 'code'
  | 'bolt'
  | 'wave'
  | 'dna'
  | 'dice';

interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function AppIcon({
  name,
  size = 20,
  color = BrandColors.sandDune,
  strokeWidth = 2,
}: AppIconProps) {
  const renderIconContent = () => {
    switch (name) {
      case 'settings':
        return (
          <>
            <Circle cx="12" cy="12" r="3" />
            <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
          </>
        );
      case 'shield':
        return <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
      case 'shield-check':
        return (
          <>
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <Path d="m9 12 2 2 4-4" />
          </>
        );
      case 'shield-alert':
        return (
          <>
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <Line x1="12" y1="8" x2="12" y2="12" />
            <Line x1="12" y1="16" x2="12.01" y2="16" />
          </>
        );
      case 'play':
        return <Polygon points="5 3 19 12 5 21 5 3" fill={color} />;
      case 'logout':
        return (
          <>
            <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <Polyline points="16 17 21 12 16 7" />
            <Line x1="21" y1="12" x2="9" y2="12" />
          </>
        );
      case 'check':
        return <Polyline points="20 6 9 17 4 12" />;
      case 'alert':
        return (
          <>
            <Circle cx="12" cy="12" r="10" />
            <Line x1="12" y1="8" x2="12" y2="12" />
            <Line x1="12" y1="16" x2="12.01" y2="16" />
          </>
        );
      case 'phone':
        return (
          <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        );
      case 'phone-call':
        return (
          <>
            <Path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94" />
            <Path d="m22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </>
        );
      case 'phone-off':
        return (
          <>
            <Path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
            <Line x1="1" y1="1" x2="23" y2="23" />
          </>
        );
      case 'mic':
        return (
          <>
            <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <Line x1="12" y1="19" x2="12" y2="22" />
          </>
        );
      case 'mic-off':
        return (
          <>
            <Line x1="1" y1="1" x2="23" y2="23" />
            <Path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" />
            <Path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
            <Line x1="12" y1="19" x2="12" y2="22" />
          </>
        );
      case 'speaker':
        return (
          <>
            <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </>
        );
      case 'close':
        return (
          <>
            <Line x1="18" y1="6" x2="6" y2="18" />
            <Line x1="6" y1="6" x2="18" y2="18" />
          </>
        );
      case 'user':
        return (
          <>
            <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <Circle cx="12" cy="7" r="4" />
          </>
        );
      case 'ai':
        return (
          <>
            <Rect x="3" y="11" width="18" height="10" rx="2" />
            <Circle cx="12" cy="5" r="2" />
            <Path d="M12 7v4" />
            <Line x1="8" y1="16" x2="8.01" y2="16" />
            <Line x1="16" y1="16" x2="16.01" y2="16" />
          </>
        );
      case 'refresh':
        return (
          <>
            <Path d="M21.5 2v6h-6" />
            <Path d="M2.5 22v-6h6" />
            <Path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8" />
            <Path d="M22 12.5a10 10 0 0 1-18.8 4.2L2.5 16" />
          </>
        );
      case 'chevron-down':
        return <Polyline points="6 9 12 15 18 9" />;
      case 'chevron-right':
        return <Polyline points="9 18 15 12 9 6" />;
      case 'transfer':
        return (
          <>
            <Polyline points="17 1 21 5 17 9" />
            <Path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <Polyline points="7 23 3 19 7 15" />
            <Path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </>
        );
      case 'bank':
        return (
          <>
            <Polygon points="12 2 2 7 22 7 12 2" />
            <Rect x="4" y="10" width="2" height="8" />
            <Rect x="9.33" y="10" width="2" height="8" />
            <Rect x="14.67" y="10" width="2" height="8" />
            <Rect x="20" y="10" width="2" height="8" />
            <Line x1="1" y1="22" x2="23" y2="22" />
            <Line x1="2" y1="18" x2="22" y2="18" />
          </>
        );
      case 'wallet':
        return (
          <>
            <Path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <Path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <Path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
          </>
        );
      case 'history':
        return (
          <>
            <Circle cx="12" cy="12" r="10" />
            <Polyline points="12 6 12 12 16 14" />
          </>
        );
      case 'code':
        return (
          <>
            <Polyline points="16 18 22 12 16 6" />
            <Polyline points="8 6 2 12 8 18" />
          </>
        );
      case 'bolt':
        return <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} />;
      case 'wave':
        return (
          <>
            <Line x1="2" y1="10" x2="2" y2="14" />
            <Line x1="6" y1="6" x2="6" y2="18" />
            <Line x1="10" y1="3" x2="10" y2="21" />
            <Line x1="14" y1="8" x2="14" y2="16" />
            <Line x1="18" y1="5" x2="18" y2="19" />
            <Line x1="22" y1="10" x2="22" y2="14" />
          </>
        );
      case 'dna':
        return (
          <>
            <Path d="m2 15 20-6" />
            <Path d="M2 9l20 6" />
            <Line x1="5" y1="10" x2="5" y2="14" />
            <Line x1="12" y1="8" x2="12" y2="16" />
            <Line x1="19" y1="10" x2="19" y2="14" />
          </>
        );
      case 'dice':
        return (
          <>
            <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <Circle cx="16" cy="8" r="1" fill={color} />
            <Circle cx="8" cy="8" r="1" fill={color} />
            <Circle cx="8" cy="16" r="1" fill={color} />
            <Circle cx="16" cy="16" r="1" fill={color} />
            <Circle cx="12" cy="12" r="1" fill={color} />
          </>
        );
      default:
        return <Polyline points="20 6 9 17 4 12" />;
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round">
        {renderIconContent()}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
