import { BaseService } from "@/services/base/BaseService";
import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseService } from "@/services/firebase/data/FirebaseService";
import { Contact } from "@common/models/contacts/contact";
import { QueryOptions } from "@/services/firebase/data/query";

export class ContactService extends BaseService<Contact> {
  protected firestoreTag: FirestoreCollections = FirestoreCollections.USERS;

  protected getDefaultListQueryOptions(): QueryOptions {
    // Filter and retrieve based on connections
    return {};
  }

  protected mapper = (data: any): Contact => {
    return {
      ...data,
      searchableEmail: data.email?.toLowerCase() || "",
      searchableName: data.displayName?.toLowerCase() || "",
    } as Contact;
  };

  constructor(protected readonly firebaseService: FirebaseService) {
    super(firebaseService);
  }

  async searchUsers(searchInput: string): Promise<Contact[]> {
    const normalizedInput = searchInput.toLowerCase();

    // Query for email matches
    const emailQuery: QueryOptions = {
      where: [
        { field: "email", operator: ">=", value: normalizedInput },
        { field: "email", operator: "<=", value: normalizedInput + "\uf8ff" },
      ],
      limit: 3,
    };

    // Query for name matches
    const nameQuery: QueryOptions = {
      where: [
        { field: "displayName", operator: ">=", value: normalizedInput },
        {
          field: "displayName",
          operator: "<=",
          value: normalizedInput + "\uf8ff",
        },
      ],
      limit: 3,
    };

    // Execute both queries
    const [emailResults, nameResults] = await Promise.all([
      this.getList({ query: emailQuery }),
      this.getList({ query: nameQuery }),
    ]);

    // Combine and deduplicate results
    const combinedResults = [...emailResults, ...nameResults];
    const uniqueResults = Array.from(
      new Map(combinedResults.map((item) => [item.id, item])).values()
    );

    // Sort by relevance (exact matches first)
    return uniqueResults
      .sort((a, b) => {
        const aExactMatch =
          a.email?.toLowerCase() === normalizedInput ||
          a.displayName?.toLowerCase() === normalizedInput;
        const bExactMatch =
          b.email?.toLowerCase() === normalizedInput ||
          b.displayName?.toLowerCase() === normalizedInput;

        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        return 0;
      })
      .slice(0, 3); // Ensure we only return 3 results
  }
}
