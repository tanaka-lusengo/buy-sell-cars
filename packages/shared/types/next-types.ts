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

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export type PageProps = {
  params: Params["params"];
  searchParams: SearchParams;
};
