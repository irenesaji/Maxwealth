import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { ModelPortfolio } from 'src/model_portfolio/entities/model_portfolios.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminModelPortfoliosService extends TypeOrmCrudService<ModelPortfolio> {
  // constructor(@InjectRepository(ModelPortfolio) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const modelPortfolioRepo = new Repository<ModelPortfolio>(
      ModelPortfolio,
      dataSource.createEntityManager(),
    );
    super(modelPortfolioRepo);
  }
}
