import { CrudDto } from "@/interfaces/crud/dto/CrudDto";
import { UserDto } from "@/interfaces/user/dto/UserDto";
import { DateTime } from "luxon";

export interface ReportDto extends CrudDto {
  user: UserDto;
  reviewId?: number;
  commentId?: number;
  resolved: boolean;
  issue: string;
  text: string;
  date: DateTime;
}