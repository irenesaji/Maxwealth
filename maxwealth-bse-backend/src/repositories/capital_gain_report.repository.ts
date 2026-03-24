import { Inject, Injectable, Scope } from '@nestjs/common';
import { CapitalGainReport } from 'src/portfolio/entities/capital_gain_reports.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class CapitalGainReportRepository extends Repository<CapitalGainReport> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(CapitalGainReport, dataSource.createEntityManager());
  }
}
