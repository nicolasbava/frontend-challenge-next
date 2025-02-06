// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { RoomingListBooking } from './entities/rooming-list-booking.entity';
// import { RoomingListBookingDto } from './dto/rooming-list-booking';
// import { RoomingList } from 'src/rooming-list/entities/rooming-list.entity';
// import { Booking } from 'src/booking/entities/booking.entity';

// @Injectable()
// export class RoomingListBookingService {
//   constructor(
//     @InjectRepository(RoomingListBooking)
//     private readonly roomingListBookingRepository: Repository<RoomingListBooking>,

//     @InjectRepository(RoomingList)
//     private readonly roomingListRepository: Repository<RoomingList>,

//     @InjectRepository(Booking)
//     private readonly bookingRepository: Repository<Booking>,
//   ) {}

//   // Method to import bookings
//   async importBookings(data: RoomingListBookingDto[]): Promise<void> {
//     const bookings = await Promise.all(
//       data.map(async (item) => {
//         const booking = await this.bookingRepository.findOne({
//           where: { bookingId: item.bookingId },
//         });

//         const roomingList = await this.roomingListRepository.findOne({
//           where: { roomingListId: item.roomingListId },
//         });

//         if (!booking || !roomingList) {
//           throw new Error('Booking or RoomingList not found');
//         }

//         const roomingListBooking = new RoomingListBooking();
//         roomingListBooking.booking = booking;
//         roomingListBooking.roomingList = roomingList;

//         // Map other fields like guestName, checkInDate, etc. if needed

//         return roomingListBooking;
//       }),
//     );

//     // Save all roomingListBooking records at once
//     await this.roomingListBookingRepository.save(bookings);
//   }

// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomingListBooking } from './entities/rooming-list-booking.entity';
import { RoomingList } from 'src/rooming-list/entities/rooming-list.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { RoomingListBookingDto } from './dto/rooming-list-booking';

@Injectable()
export class RoomingListBookingService {
  constructor(
    @InjectRepository(RoomingListBooking)
    private readonly roomingListBookingRepository: Repository<RoomingListBooking>,

    @InjectRepository(RoomingList)
    private readonly roomingListRepository: Repository<RoomingList>,

    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async importBookings(data: RoomingListBookingDto[]): Promise<void> {
    const bookings = await Promise.all(
      data.map(async (item) => {
        const booking = await this.bookingRepository.findOne({
          where: { bookingId: item.bookingId },
        });
        if (!booking) {
          throw new NotFoundException(
            `Booking with ID ${item.bookingId} not found.`,
          );
        }

        const roomingList = await this.roomingListRepository.findOne({
          where: { roomingListId: item.roomingListId },
        });
        if (!roomingList) {
          throw new NotFoundException(
            `Rooming List with ID ${item.roomingListId} not found.`,
          );
        }

        if (!booking || !roomingList) {
          throw new Error('Booking or RoomingList not found');
        }

        const roomingListBooking = new RoomingListBooking();
        roomingListBooking.booking = booking;
        roomingListBooking.roomingList = roomingList;

        return roomingListBooking;
      }),
    );

    // Save all roomingListBooking records at once
    await this.roomingListBookingRepository.save(bookings);
  }

  // Method to delete all records with cascading effect
  async deleteAllData(): Promise<{ message: string }> {
    await this.roomingListBookingRepository.query(`
      TRUNCATE TABLE rooming_list_bookings, bookings, rooming_lists CASCADE;
    `);

    return { message: 'All bookings have been deleted' };
  }
}
