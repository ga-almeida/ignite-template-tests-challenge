interface ICreateTransferDTO {
  sender_id: string;
  user_id: string;
  amount: number;
  description: string;
}

export { ICreateTransferDTO };
