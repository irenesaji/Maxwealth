import { Inject, Injectable, Scope } from '@nestjs/common';
import { TextDocument } from 'src/fund_details/entities/text_document.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class TextDocumentRepository extends Repository<TextDocument> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(TextDocument, dataSource.createEntityManager());
  }
}
