import React, { useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../theme/hooks/useTheme";

export interface Slide<T> {
  content: React.ReactNode;
  title: string;
  id: string;
  data?: T;
}

interface SliderProps<T> {
  slides: Slide<T>[];
  renderSlide?: (slide: Slide<T>) => React.ReactNode;
  onSlideChange?: (index: number) => void;
  initialIndex?: number;
  disabled?: boolean;
}

export const Slider = <T,>({
  slides,
  renderSlide = (slide) => slide.content,
  onSlideChange,
  initialIndex = 0,
  disabled = false,
}: SliderProps<T>) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const { colors } = useTheme();

  const handleSlideChange = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      onSlideChange?.(index);
    },
    [onSlideChange]
  );

  const handleNext = useCallback(() => {
    if (disabled) return;
    const newIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
    handleSlideChange(newIndex);
  }, [currentIndex, slides.length, handleSlideChange, disabled]);

  const handlePrevious = useCallback(() => {
    if (disabled) return;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
    handleSlideChange(newIndex);
  }, [currentIndex, slides.length, handleSlideChange, disabled]);

  const currentSlide = slides[currentIndex];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.navButton,
          styles.leftButton,
          disabled && styles.disabledBtn,
        ]}
        onPress={handlePrevious}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          size={20}
          color={colors.primary.main}
        />
      </TouchableOpacity>

      <View style={styles.slideContainer}>
        {currentSlide && renderSlide(currentSlide)}
      </View>

      <TouchableOpacity
        style={[
          styles.navButton,
          styles.rightButton,
          disabled && styles.disabledBtn,
        ]}
        onPress={handleNext}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <FontAwesomeIcon
          icon={faChevronRight}
          size={20}
          color={colors.primary.main}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    position: "relative",
  },
  slideContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  leftButton: {
    marginRight: 8,
  },
  rightButton: {
    marginLeft: 8,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
