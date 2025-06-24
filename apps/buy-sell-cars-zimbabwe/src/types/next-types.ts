import { CategoryType } from "./index";

export type ParamsWithUserCategory = {
  params: {
    user_category: CategoryType[number];
  };
};
