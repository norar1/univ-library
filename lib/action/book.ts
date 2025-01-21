"use server";

import { db } from "@/database/dizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
    const { userId, bookId } = params;

    try {
        // Fetch book details from the database
        const book = await db
            .select({ availableCopies: books.availableCopies })
            .from(books)
            .where(eq(books.id, bookId))
            .limit(1);

        // Check if book is available for borrowing
        if (book.length === 0 || book[0].availableCopies <= 0) {
            return {
                success: false,
                error: "Book is not available for borrowing"
            };
        }

        // Calculate due date for the borrowed book (7 days from now)
        const dueDate = dayjs().add(7, 'days').toDate().toDateString();

        // Insert borrow record into borrowRecords table
        const record = await db.insert(borrowRecords).values({
            userId, bookId, dueDate, status: "BORROWED",
        });

        // Update the book's availableCopies
        await db.update(books)
            .set({ availableCopies: book[0].availableCopies - 1 })
            .where(eq(books.id, bookId));

        return {
            success: true,
            data: JSON.parse(JSON.stringify(record))
        };
    } catch (e) {
        console.log(e);

        return { success: false, error: 'An error occurred while borrowing the book' };
    }
};
