import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferOfAmountsBetweenAccountsUseCase } from "./TransferOfAmountsBetweenAccountsUseCase";


class TransferOfAmountsBetweenAccountsController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: sender_id } = request.user;
    const { user_id } = request.params;
    const { amount, description } = request.body;

    const transferOfAmountsBetweenAccountsUseCase = container.resolve(TransferOfAmountsBetweenAccountsUseCase);

    await transferOfAmountsBetweenAccountsUseCase.execute({
      sender_id,
      user_id,
      amount,
      description,
    });

    return response.status(201).send();
  }
}

export { TransferOfAmountsBetweenAccountsController }
