import { baseModelMapper } from "@/services/base/mappers";
import { Settings } from "./models";

export class SettingsMapper {
  static map(data: any): Settings {
    return {
      ...baseModelMapper(data),
      model: data.model != null ? data.model : undefined,
      language: data.language != null ? data.language : undefined,
      notifications:
        data.notifications != null ? data.notifications : undefined,
      theme: data.theme != null ? data.theme : undefined,
    };
  }
}
