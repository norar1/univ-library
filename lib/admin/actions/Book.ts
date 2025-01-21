'use server';
import { db } from "@/database/dizzle";
import { books } from "@/database/schema";


export const createBook = async (params: BookParams) => {
    try {
        const newBook = await db.insert(books).values({
            ...params,
            availableCopies: params.totalCopies,
        }).returning();

        return {
            success: true,
            data: newBook[0],
        };
    } catch (e) {
        console.log(e);
        return {
            success: false,
            message: 'An error occurred while creating book',
        };
    }
};
