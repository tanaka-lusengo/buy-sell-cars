import { CategoryType } from "./index";

export type Params = {
  params: {
    slug: string;
  };
};

export type ParamsWithId = {
  params: {
    slug: string;
    id: string;
  };
};

export type ParamsWithUserCategory = {
  params: {
    user_category: CategoryType[number];
  };
};
