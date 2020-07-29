// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    let categorySelected = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categorySelected) {
      categorySelected = categoryRepository.create({ title: category });
      await categoryRepository.save(categorySelected);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: categorySelected,
    });
    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
