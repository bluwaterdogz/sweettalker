import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated, ViewStyle, Pressable } from "react-native";
import { useTheme } from "../../theme/hooks/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped?: boolean;
  onFlip?: () => void;
  style?: ViewStyle;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  front,
  back,
  isFlipped = false,
  onFlip,
  style,
}) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const frontRef = useRef<View>(null);
  const [frontHeight, setFrontHeight] = React.useState(0);
  const { colors } = useTheme();

  useEffect(() => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background.primary },
        style,
      ]}
    >
      {/* <Pressable
        ref={frontRef}
        // onPress={onFlip}
        style={{
          backgroundColor: "red",
        }}
        onLayout={(e) => setFrontHeight(e.nativeEvent.layout.height)}
      > */}
      <Animated.View style={[styles.card, frontAnimatedStyle]}>
        <FontAwesomeIcon
          icon={faRotate}
          size={20}
          style={styles.flipButton}
          color={colors.text.primary}
        />
        {front}
      </Animated.View>
      <Animated.View
        style={[
          styles.card,
          styles.back,
          backAnimatedStyle,
          { height: frontHeight },
        ]}
      >
        <FontAwesomeIcon
          icon={faRotate}
          size={20}
          style={styles.flipButton}
          color={colors.text.primary}
        />
        {back}
      </Animated.View>
      {/* </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  card: {
    width: "100%",
    backfaceVisibility: "hidden",
    borderRadius: 12,
  },
  back: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  flipButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
