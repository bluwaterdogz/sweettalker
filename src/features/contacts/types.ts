import { Connection } from "@common/models/contacts/connection";
import { Contact } from "@common/models/contacts/contact";

export interface ContactWithConnection extends Contact {
  connection?: Connection;
}
