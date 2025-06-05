import React, { useState, useRef, useEffect, ReactNode } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { useTheme } from "../../theme/hooks/useTheme";
import { Icon } from "../Icon";
import {
  faEdit,
  faPen,
  faSave,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "@/i18n/hooks/useTranslation";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: any;
  multiline?: boolean;
  inputStyle?: any;
  editable?: boolean;
  controls?: ReactNode;
  disabled?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  placeholder = "",
  style,
  multiline = false,
  inputStyle,
  editable = true,
  controls,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleSave = () => {
    setIsEditing(false);
    if (text !== value) {
      onChange(text);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setText(value);
  };

  return (
    <View style={[styles.container, style, disabled && styles.disabled]}>
      {editable && isEditing ? (
        <View style={styles.textWrapper}>
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            style={[styles.input, inputStyle, disabled && styles.disabledInput]}
            placeholder={t(placeholder)}
            placeholderTextColor={colors.text.secondary}
            multiline={multiline}
            editable={editable && !disabled}
          />
          <TouchableOpacity
            onPress={handleSave}
            disabled={!editable || disabled}
          >
            {editable && !disabled && (
              <Icon icon={faSave} size={16} color={colors.text.secondary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancel}
            disabled={!editable || disabled}
          >
            {editable && !disabled && (
              <Icon icon={faXmark} size={16} color={colors.text.secondary} />
            )}
          </TouchableOpacity>
          {controls}
        </View>
      ) : (
        <View style={styles.textWrapper}>
          <Text style={[inputStyle, { flex: 1 }]}>{value || placeholder}</Text>
          <TouchableOpacity
            onPress={handleEdit}
            disabled={!editable || disabled}
          >
            {editable && !disabled && (
              <Icon icon={faPen} size={16} color={colors.text.secondary} />
            )}
          </TouchableOpacity>
          {controls}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  textWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  text: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    minHeight: 36,
    lineHeight: 24,
    borderWidth: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
  },
});
