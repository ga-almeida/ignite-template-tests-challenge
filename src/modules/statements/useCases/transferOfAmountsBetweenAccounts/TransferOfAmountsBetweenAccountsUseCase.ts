import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateTransferDTO } from "./ICreateTransferDTO";
import { TransferOfAmountsBetweenAccountsError } from "./TransferOfAmountsBetweenAccountsError";

@injectable()
class TransferOfAmountsBetweenAccountsUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    amount,
    description,
    sender_id,
    user_id,
  }: ICreateTransferDTO): Promise<void> {
    const receiverUserExists = await this.usersRepository.findById(user_id);

    if (!receiverUserExists) {
      throw new TransferOfAmountsBetweenAccountsError.UserNotFound();
    }

    const senderUserBalance = await this.statementsRepository.getUserBalance({
      user_id
    });

    if (amount > senderUserBalance.balance) {
      throw new TransferOfAmountsBetweenAccountsError.InsufficientFunds();
    }

    await this.statementsRepository.create({
      amount,
      description,
      type: 'transfer' as OperationType,
      user_id,
      sender_id
    });
  }
}

export { TransferOfAmountsBetweenAccountsUseCase };
