import { JsonNullable } from "@/types/JsonNullable";

export interface WatchListUpdateDto {
  name: JsonNullable<string>;
  visibility?: JsonNullable<boolean>;
}