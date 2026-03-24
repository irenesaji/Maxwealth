import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ModelPortfolioFund } from 'src/model_portfolio/entities/model_portfolio_funds.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class ModelPortfolioFundRepository extends Repository<ModelPortfolioFund> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(ModelPortfolioFund, dataSource.createEntityManager());
  }
}
