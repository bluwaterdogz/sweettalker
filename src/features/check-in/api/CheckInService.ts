import { CheckIn, CheckInMapper } from "@common/models/check-in/check-in";
import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseService } from "@/services/firebase/data/FirebaseService";
import { AuthService } from "@/features/auth/api/service";
import { BaseUserServiceCustomId } from "@/services/base/BaseUserServiceCustomId";

export class CheckInService extends BaseUserServiceCustomId<CheckIn, CheckIn> {
  protected firestoreTag: FirestoreCollections.CHECK_INS =
    FirestoreCollections.CHECK_INS;
  protected mapper = CheckInMapper.map;

  constructor(
    protected readonly firebaseService: FirebaseService,
    protected readonly authService: AuthService
  ) {
    super(firebaseService, authService);
  }

  getId() {
    const now = new Date();
    const id = formatDate(now);
    return id;
  }
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}
