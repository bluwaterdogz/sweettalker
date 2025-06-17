import React from "react";
import { ContactItem } from "./ContactItem";
import { ContactWithConnection } from "../types";
import { SearchableList } from "@/common/components/SearchableList";

interface ContactListProps {
  searchValue?: string;
  setSearchValue?: (value: string) => void;
  users: ContactWithConnection[];
  onPress?: (item: ContactWithConnection) => void;
  renderItemControls?: (item: ContactWithConnection) => React.ReactNode;
}

export const ContactList: React.FC<ContactListProps> = ({
  users,
  onPress,
  renderItemControls,
  searchValue,
  setSearchValue,
}) => {
  return (
    <SearchableList
      data={users}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      useInternalSearchFilter={!setSearchValue}
      searchKeys={["displayName", "email"]}
      renderItem={(item: ContactWithConnection) => {
        return (
          <ContactItem
            key={item.id}
            contact={item}
            onPress={() => onPress?.(item)}
          >
            {renderItemControls?.(item)}
          </ContactItem>
        );
      }}
    />
  );
};
