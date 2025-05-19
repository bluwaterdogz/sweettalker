import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { typography, useTheme } from "@/common/theme/hooks/useTheme";
import { Rating, CardHeader } from "@/common/components";
import { Interpretation } from "../api/models";
import { formatTimeStamp } from "@/common/utils";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { useConfirmation } from "@/common/features/Confirmation";

interface InterpretationCardHeaderProps {
  entity: Interpretation;
  title: string;
  onUpdate: (id: string, data: Partial<Interpretation>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  children?: React.ReactNode;
}

export const InterpretationCardHeader: React.FC<
  InterpretationCardHeaderProps
> = ({ entity, title, onUpdate, onDelete, children = null }) => {
  const { colors } = useTheme();
  const confirm = useConfirmation();
  const handleRating = useCallback(
    (val: number) => {
      onUpdate(entity.id, { rating: val });
    },
    [onUpdate, entity.id]
  );

  const handleFavorite = useCallback(() => {
    onUpdate(entity.id, {
      favorite: !entity.favorite,
    });
  }, [onUpdate, entity.id, entity.favorite]);

  const handleEditTitle = useCallback(
    (value: string) => {
      onUpdate(entity.id, {
        title: value,
      });
    },
    [onUpdate, entity.id]
  );

  const handleDelete = useCallback(() => {
    const id = entity.id;
    confirm({
      title: "Delete Interpretation",
      message: "Are you sure you want to delete this interpretation?",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => {
        onDelete(id);
      },
    });
  }, [onDelete, entity.id]);

  const formattedDate = useMemo(
    () => formatTimeStamp(entity.createdAt),
    [entity.createdAt]
  );

  const formattedUpdatedDate = useMemo(
    () => formatTimeStamp(entity.updatedAt),
    [entity.updatedAt]
  );

  return (
    <CardHeader
      title={title}
      onEditTitle={handleEditTitle}
      controls={
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Text onPress={handleFavorite}>
            <FontAwesomeIcon
              icon={entity.favorite ? faStar : faStarEmpty}
              size={15}
              color={colors.text.secondary}
            />
          </Text>
          <Text onPress={handleDelete}>
            <FontAwesomeIcon
              icon={faTrash}
              size={15}
              color={colors.text.secondary}
            />
          </Text>
        </View>
      }
    >
      <View
        style={[
          styles.ratingContainer,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <Rating value={entity.rating || 0} onChange={handleRating} />
      </View>
      <Text style={[typography.bodySmall, { color: colors.text.primary }]}>
        {formattedDate}
        {formattedUpdatedDate ? ` (Updated: ${formattedUpdatedDate})` : ""}
      </Text>
      {children}
    </CardHeader>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
});
