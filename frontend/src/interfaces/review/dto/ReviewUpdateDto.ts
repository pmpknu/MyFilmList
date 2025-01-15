import { JsonNullable } from "@/types/JsonNullable";

export interface ReviewUpdateDto {
  text: JsonNullable<string>;
  visible: JsonNullable<boolean>;
  rating: JsonNullable<number>; // 1-10
}