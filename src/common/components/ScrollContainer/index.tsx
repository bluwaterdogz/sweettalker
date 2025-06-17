import React, { useRef, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  ViewStyle,
  ScrollViewProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  LayoutChangeEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/common/theme/hooks/useTheme";

interface ScrollContainerProps extends ScrollViewProps {
  fadeTop?: boolean;
  fadeBottom?: boolean;
  fadeLeft?: boolean;
  fadeRight?: boolean;
  fadeColor?: string;
  fadeSize?: number;
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

type FadeDirection = "top" | "bottom" | "left" | "right";

export const ScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  fadeTop = true,
  fadeBottom = true,
  fadeLeft = false,
  fadeRight = false,
  fadeColor,
  fadeSize = 10,
  containerStyle,
  contentContainerStyle,
  onScroll,
  ...scrollViewProps
}) => {
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollY] = useState(new Animated.Value(0));
  const [scrollX] = useState(new Animated.Value(0));

  const finalFadeColor = fadeColor || colors.shadow.primary;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { y, x } = event.nativeEvent.contentOffset;
      scrollY.setValue(y);
      scrollX.setValue(x);
      onScroll?.(event);
    },
    [onScroll]
  );

  const handleContentSizeChange = useCallback((_: number, height: number) => {
    setContentHeight(height);
  }, []);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerHeight(event.nativeEvent.layout.height);
  }, []);

  const verticalOverflow = contentHeight > containerHeight;
  const scrollEnd = Math.max(contentHeight - containerHeight, 0);
  const scrollFadeStart = Math.max(scrollEnd - fadeSize, 0);

  const topFadeOpacity = scrollY.interpolate({
    inputRange: [0, fadeSize],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const bottomFadeOpacity = scrollY.interpolate({
    inputRange: [scrollFadeStart, scrollEnd],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const fadeConfigs: {
    show: boolean;
    direction: FadeDirection;
    style: ViewStyle;
    colors: [string, string];
    opacity: Animated.AnimatedInterpolation<number>;
  }[] = [
    {
      show: fadeTop && verticalOverflow,
      direction: "top",
      style: styles.fadeTop,
      colors: [`${finalFadeColor}44`, `${finalFadeColor}00`],
      opacity: topFadeOpacity,
    },
    {
      show: fadeBottom && verticalOverflow,
      direction: "bottom",
      style: styles.fadeBottom,
      colors: [`${finalFadeColor}00`, `${finalFadeColor}44`],
      opacity: bottomFadeOpacity,
    },
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleContainerLayout}
        scrollEventThrottle={16}
        contentContainerStyle={contentContainerStyle}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>

      {fadeConfigs.map(
        ({ show, direction, style, colors, opacity }) =>
          show && (
            <Animated.View
              key={direction}
              style={[
                styles.fadeBase,
                style,
                {
                  opacity,
                  height: fadeSize,
                  borderTopLeftRadius: direction === "top" ? fadeSize : 0,
                  borderTopRightRadius: direction === "top" ? fadeSize : 0,
                  borderBottomLeftRadius: direction === "bottom" ? fadeSize : 0,
                  borderBottomRightRadius:
                    direction === "bottom" ? fadeSize : 0,
                  overflow: "hidden",
                },
              ]}
              pointerEvents="none"
            >
              <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  fadeBase: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1,
  },
  fadeTop: {
    top: 0,
  },
  fadeBottom: {
    bottom: 0,
  },
});
