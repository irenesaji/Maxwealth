import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { ModelPortfolioFund } from 'src/model_portfolio/entities/model_portfolio_funds.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminModelPortfolioFundsService extends TypeOrmCrudService<ModelPortfolioFund> {
  // constructor(@InjectRepository(ModelPortfolioFund) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const modelPortfolioFundRepo = new Repository<ModelPortfolioFund>(
      ModelPortfolioFund,
      dataSource.createEntityManager(),
    );
    super(modelPortfolioFundRepo);
  }
}
