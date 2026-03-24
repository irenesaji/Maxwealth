import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ModelPortfolio } from 'src/model_portfolio/entities/model_portfolios.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class ModelPortfolioRepository extends Repository<ModelPortfolio> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(ModelPortfolio, dataSource.createEntityManager());
  }
}
