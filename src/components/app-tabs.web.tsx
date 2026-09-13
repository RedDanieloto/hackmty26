import React from 'react';
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon, IconName } from './ui/app-icon';
import { BrandColors } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs style={styles.tabsRoot}>
      <TabSlot style={styles.tabSlot} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="bank">Inicio</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton icon="history">Auditoría</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

interface TabButtonProps extends TabTriggerSlotProps {
  icon?: IconName;
}

export function TabButton({ children, isFocused, icon, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <View
        style={[
          styles.tabButtonInner,
          isFocused && styles.tabButtonInnerActive,
        ]}>
        {icon && (
          <AppIcon
            name={icon}
            size={15}
            color={isFocused ? BrandColors.sandDuneLight : BrandColors.sandDuneMuted}
          />
        )}
        <Text
          style={[
            styles.tabButtonText,
            isFocused ? styles.tabButtonTextActive : styles.tabButtonTextInactive,
          ]}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.floatingBar}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRoot: {
    flex: 1,
    height: '100%',
  },
  tabSlot: {
    flex: 1,
    height: '100%',
  },
  tabListContainer: {
    position: 'fixed' as any,
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 999,
    pointerEvents: 'box-none',
  },
  floatingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 34, 23, 0.94)',
    borderRadius: 32,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.24)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 12,
    gap: 6,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        } as any)
      : {}),
  },
  tabButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  tabButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  tabButtonInnerActive: {
    backgroundColor: BrandColors.hunterGreen,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.3)',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  tabButtonTextActive: {
    color: BrandColors.sandDuneLight,
    fontWeight: '700',
  },
  tabButtonTextInactive: {
    color: BrandColors.sandDuneMuted,
  },
  pressed: {
    opacity: 0.75,
  },
});
