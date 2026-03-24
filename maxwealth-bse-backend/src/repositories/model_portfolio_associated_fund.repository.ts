import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ModelPortfolioAssociatedFund } from 'src/model_portfolio/entities/model_portfolio_associated_fund.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class ModelPortfolioAssociatedFundRepository extends Repository<ModelPortfolioAssociatedFund> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(ModelPortfolioAssociatedFund, dataSource.createEntityManager());
  }
}
