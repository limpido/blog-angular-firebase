import {Category} from "./category";

export interface Blog {
  category?: Category;
  title?: string;
  summary?: string;
  image_url?: string;
  content?: string;
  last_edited_timestamp?: number;
  docId?: string;
}
