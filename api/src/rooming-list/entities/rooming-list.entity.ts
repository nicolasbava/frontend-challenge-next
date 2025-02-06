import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RoomingListBooking } from '../../rooming-list-booking/entities/rooming-list-booking.entity';

@Entity('rooming_lists')
export class RoomingList {
  @PrimaryGeneratedColumn()
  roomingListId!: number;

  @Column({ type: 'integer', nullable: true })
  eventId!: number | null;

  // @Column()
  // event_name!: string;

  @Column({ type: 'integer', nullable: true })
  hotelId!: number;

  @Column({ length: 255, nullable: true })
  rfpName!: string;

  @Column({ type: 'date', nullable: true })
  cutOffDate!: string;

  @Column({ length: 255, nullable: true })
  status!: string;

  @Column({ length: 255, nullable: true })
  agreement_type!: string;

  @OneToMany(() => RoomingListBooking, (rlb) => rlb.roomingList)
  roomingListBookings!: RoomingListBooking[];
}
