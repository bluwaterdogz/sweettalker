import React, { useState, useRef, useEffect, ReactNode } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { useTheme } from "../../../theme/context";
import { Icon } from "@/components/common";
import { faEdit, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: any;
  multiline?: boolean;
  inputStyle?: any;
  editable?: boolean;
  controls?: ReactNode;
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
}) => {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<TextInput>(null);

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
    <View style={[styles.container, style]}>
      {editable && isEditing ? (
        <View style={styles.textWrapper}>
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            style={[styles.input, inputStyle]}
            placeholder={placeholder}
            placeholderTextColor={colors.text.secondary}
            multiline={multiline}
            editable={editable}
          />
          <TouchableOpacity onPress={handleSave} disabled={!editable}>
            {editable && (
              <Icon icon={faSave} size={16} color={colors.text.secondary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancel} disabled={!editable}>
            {editable && (
              <Icon icon={faXmark} size={16} color={colors.text.secondary} />
            )}
          </TouchableOpacity>
          {controls}
        </View>
      ) : (
        <View style={styles.textWrapper}>
          <Text style={[inputStyle, { flex: 1 }]}>{value || placeholder}</Text>
          <TouchableOpacity onPress={handleEdit} disabled={!editable}>
            {editable && (
              <Icon icon={faEdit} size={16} color={colors.text.secondary} />
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

    borderWidth: 0,
  },
});
