import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'application_statuses' })
export class ApplicationStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  application_status_code: string;

  @Column({ type: 'varchar', length: 100 })
  application_status_description: string;
}
