export type TModelKey = {
  id: string;
};

export const isIdPresent = <T extends object>(
  obj: TModelKey | T,
): obj is TModelKey => {
  return "id" in obj;
};
