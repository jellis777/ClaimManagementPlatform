export type Claim = {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: string;
  createdAt: string;
};

export type CreateClaimRequest = {
  title: string;
  description: string;
  amount: number;
};

export type CreateClaimFormData = {
  title: string;
  description: string;
  amount: string;
};

export type UpdateClaimRequest = {
  title: string;
  description: string;
  amount: number;
  status: string;
};

export type UpdateClaimFormData = {
  title: string;
  description: string;
  amount: string;
  status: string;
};
