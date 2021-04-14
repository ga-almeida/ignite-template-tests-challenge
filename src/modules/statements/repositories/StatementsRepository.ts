import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    sender_id,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type,
      sender_id
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = await this.repository.find({
      where: { user_id }
    });

    const statementTransfer = await this.repository.find({
      select: ["id", "user_id", "description", "amount", "type", "created_at", "updated_at"],
      where: { sender_id: user_id }
    })

    const depositWithdrawBalance = statement.reduceRight((acc, operation) => {
      if(operation.type === 'transfer' && operation.sender_id !== user_id){
        return acc + Number(operation.amount);
      } else {
        if(operation.type === 'deposit') {
          return acc + Number(operation.amount);
        } else {
          return acc - Number(operation.amount);
        }
      }
    }, 0)

    const transferBalance = await statementTransfer.reduce((acc, operation) => (acc - operation.amount), 0)

    const balance = depositWithdrawBalance + transferBalance;
    const allStatements = statement.concat(statementTransfer)

    if (with_statement) {
      return {
        statement: allStatements,
        balance
      }
    }

    return { balance }
  }
}
