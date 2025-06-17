import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
  StyleSheet,
  Animated,
  ViewStyle,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/common/theme/hooks/useTheme";

interface ScrollableListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  refreshing?: boolean;
  onRefresh?: () => void;
  scrollToBottom?: boolean;
  scrollToTop?: boolean;
  fadeTop?: boolean;
  fadeBottom?: boolean;
  fadeSize?: number;
  fadeOpacity?: number;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  onScrollPositionChange?: (isAtBottom: boolean, isAtTop: boolean) => void;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  itemSeparatorStyle?: ViewStyle;
  listStyle?: ViewStyle;
  showItemSeparator?: boolean;
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  ItemSeparatorComponent?: React.ComponentType<any> | null;
}

export function ScrollableList<T>({
  data,
  renderItem,
  keyExtractor,
  refreshing = false,
  onRefresh,
  scrollToBottom = false,
  scrollToTop = false,
  fadeTop = true,
  fadeBottom = true,
  fadeSize = 15,
  fadeOpacity = 0.6,
  onEndReached,
  onEndReachedThreshold = 0.1,
  onScrollPositionChange,
  style,
  listStyle,
  contentContainerStyle,
  itemSeparatorStyle,
  showItemSeparator = false,
  ListHeaderComponent,
  ListFooterComponent,
  ItemSeparatorComponent,
}: ScrollableListProps<T>) {
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(scrollToBottom);
  const [isScrolledToTop, setIsScrolledToTop] = useState(scrollToTop);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollY] = useState(new Animated.Value(0));
  const lastDataLength = useRef(data.length);

  // Item separator component
  const defaultItemSeparator = useCallback(
    () => (
      <View
        style={[
          styles.separator,
          { borderBottomColor: colors.neutral[200] },
          itemSeparatorStyle,
        ]}
      />
    ),
    [colors.neutral, itemSeparatorStyle]
  );

  // Initial scroll position
  useEffect(() => {
    if (data.length > 0) {
      if (scrollToBottom) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
        }, 100);
      } else if (scrollToTop) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, 100);
      }
    }
  }, [scrollToBottom, scrollToTop]);

  // Handle data changes
  useEffect(() => {
    if (data.length > lastDataLength.current) {
      if (scrollToBottom && isScrolledToBottom) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else if (scrollToTop && isScrolledToTop) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }, 100);
      }
    }
    lastDataLength.current = data.length;
  }, [
    data.length,
    isScrolledToBottom,
    isScrolledToTop,
    scrollToBottom,
    scrollToTop,
  ]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const paddingToBottom = 20;
      const paddingToTop = 20;

      scrollY.setValue(contentOffset.y);

      const isAtBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;

      const isAtTop = contentOffset.y <= paddingToTop;

      setIsScrolledToBottom(isAtBottom);
      setIsScrolledToTop(isAtTop);

      onScrollPositionChange?.(isAtBottom, isAtTop);

      // Handle onEndReached
      if (onEndReached && isAtBottom) {
        onEndReached();
      }
    },
    [onScrollPositionChange, onEndReached, scrollY]
  );

  const handleContentSizeChange = useCallback(
    (width: number, height: number) => {
      setContentHeight(height);
      if (scrollToBottom && isScrolledToBottom) {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      } else if (scrollToTop && isScrolledToTop) {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      }
    },
    [isScrolledToBottom, isScrolledToTop, scrollToBottom, scrollToTop]
  );

  const handleLayout = useCallback((event: any) => {
    setContainerHeight(event.nativeEvent.layout.height);
  }, []);

  // Fade calculations
  const verticalOverflow = contentHeight > containerHeight;
  const scrollEnd = Math.max(contentHeight - containerHeight, 0);
  const scrollFadeStart = Math.max(scrollEnd - fadeSize, 0);

  const topFadeOpacity = scrollY.interpolate({
    inputRange: [0, fadeSize],
    outputRange: [0, fadeOpacity],
    extrapolate: "clamp",
  });

  const bottomFadeOpacity = scrollY.interpolate({
    inputRange: [scrollFadeStart, scrollEnd],
    outputRange: [fadeOpacity, 0],
    extrapolate: "clamp",
  });

  const finalFadeColor = colors.shadow.primary;

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        style={[styles.scrollView, listStyle]}
        contentContainerStyle={contentContainerStyle}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        {ListHeaderComponent}
        {data.map((item, index) => (
          <React.Fragment key={keyExtractor(item, index)}>
            {renderItem(item, index)}
            {showItemSeparator &&
              index < data.length - 1 &&
              (ItemSeparatorComponent ? (
                <ItemSeparatorComponent />
              ) : (
                defaultItemSeparator()
              ))}
          </React.Fragment>
        ))}
        {ListFooterComponent}
      </ScrollView>

      {/* Top fade */}
      {fadeTop && verticalOverflow && (
        <Animated.View
          style={[
            styles.fadeTop,
            {
              opacity: topFadeOpacity,
              height: fadeSize,
            },
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={[`${finalFadeColor}66`, `${finalFadeColor}00`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}

      {/* Bottom fade */}
      {fadeBottom && verticalOverflow && (
        <Animated.View
          style={[
            styles.fadeBottom,
            {
              opacity: bottomFadeOpacity,
              height: fadeSize,
            },
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={[`${finalFadeColor}00`, `${finalFadeColor}66`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  separator: {
    borderBottomWidth: 1,
  },
});
