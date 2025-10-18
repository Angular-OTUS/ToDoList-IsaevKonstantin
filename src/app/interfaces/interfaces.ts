import { TStatus } from "../types/types";

export interface IToDoItem {
  id: number,
  text: string,
  description: string,
  status: TStatus,
}

export interface INewToDoItem {
  text: string,
  description: string,
}
