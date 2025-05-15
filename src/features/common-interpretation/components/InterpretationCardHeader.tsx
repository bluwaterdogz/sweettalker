import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { typography, useTheme } from "@/theme";
import { Colors } from "@/theme/colors";
import { Rating, CardHeader } from "@/components/common";
import { Interpretation } from "../api/models";
import { formatDate } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
interface InterpretationCardHeaderProps {
  entity: Interpretation;
  title: string;
  updateInterpretation: (
    id: string,
    data: Partial<Interpretation>
  ) => Promise<void>;
  children?: React.ReactNode;
}

export const InterpretationCardHeader: React.FC<
  InterpretationCardHeaderProps
> = ({ entity, title, updateInterpretation, children = null }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const handleRating = useCallback(
    (val: number) => {
      updateInterpretation(entity.id, { rating: val });
    },
    [updateInterpretation, entity.id]
  );

  const handleFavorite = useCallback(() => {
    updateInterpretation(entity.id, {
      favorite: !entity.favorite,
    });
  }, [updateInterpretation, entity.id, entity.favorite]);

  const handleEditTitle = useCallback(
    (value: string) => {
      updateInterpretation(entity.id, {
        title: value,
      });
    },
    [updateInterpretation, entity.id]
  );

  const favoriteColor = useMemo(() => {
    return entity.favorite ? colors.primary.main : colors.text.secondary;
  }, [entity.favorite, colors.primary.main, colors.text.secondary]);

  const formattedDate = useMemo(
    () => formatDate(entity.createdAt),
    [entity.createdAt]
  );

  const formattedUpdatedDate = useMemo(
    () => formatDate(entity.updatedAt),
    [entity.updatedAt]
  );

  return (
    <CardHeader
      title={title}
      onEditTitle={handleEditTitle}
      controls={
        <View>
          <Text onPress={handleFavorite}>
            <FontAwesomeIcon
              icon={entity.favorite ? faStar : faStarEmpty}
              size={15}
              color={favoriteColor}
            />
          </Text>
        </View>
      }
    >
      <View style={[{ flexDirection: "row", justifyContent: "space-between" }]}>
        <Rating value={entity.rating || 0} onChange={handleRating} />
      </View>
      <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
        {formattedDate}
        {formattedUpdatedDate ? ` - (Updated: ${formattedUpdatedDate})` : ""}
      </Text>
      {children}
    </CardHeader>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    content: {
      flex: 1,
      display: "flex",
      gap: 8,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    favorite: {
      fontWeight: "bold",
    },
    description: {},
    text: {
      marginVertical: 4,
      color: colors.text.primary,
    },
  });
