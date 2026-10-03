import { prisma } from "../config/prisma";

export const createOrGetChat = async (userAId: string, userBId: string) => {
    if (userAId === userBId) {
        throw new Error("Users cannot chat with themselves");
    }

    //check if both users exists
    const users = await prisma.user.findMany({
        where: {
            id: { in: [userAId, userBId] },
        },
        select: {
            id: true,
        },
    });

    if (users.length !== 2) {
        throw new Error("One or both users do not exist");
    }

    // Check if a chat already exists between these users
    const existingChats = await prisma.chat.findMany({
        where: {
            members: {
                some: { userId: userAId },
            },
        },
        include: {
            members: true,
        },
    });

    const existingChat = existingChats.find((chat) => {
        const memberIds = chat.members.map((member) => member.userId);

        return memberIds.length === 2 && memberIds.includes(userAId) && memberIds.includes(userBId);
    });

    if (existingChat) {
        return { chatId: existingChat.id };
    }

    // Create a new chat
    const chat = await prisma.chat.create({
        data: {
            members: {
                create: [{ userId: userAId }, { userId: userBId }],
            },
        },
    });

    return { chatId: chat.id };
};
