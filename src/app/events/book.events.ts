import { EventEmitter } from 'nodemailer/lib/xoauth2';
import prisma from '../../shared/prisma';
enum EbookEvents {
  INCREMENT_READ_COUNT = 'incrementReadCount',
}
// write events which call get id of book and update the read count
const bookEvents = new EventEmitter();

bookEvents.on(EbookEvents.INCREMENT_READ_COUNT, async (bookId: string) => {
  console.log('event trigger', { bookId });
  const book = await prisma.book.update({
    where: { id: bookId },
    data: { totalRead: { increment: 1 } },
  });
});
export { bookEvents, EbookEvents };
