// Generated Code, Do not modify
import { makeModelParams } from "@five12days/core";

export type TProfile = {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  profileId: number;
};

export const makeProfile = ({
  generateId,
  validateModel,
}: makeModelParams<TProfile>) => {
  return (modelData: TProfile) => {
    const model = {
      id: generateId(),
      createdAt: modelData.createdAt,
      updatedAt: modelData.updatedAt,
      profileId: modelData.profileId,
    };
    return model;
  };
};
