import { NO_TARGET_USER_FOR_CHAT } from "@/lib/error-consts";
import prismaClient from "@/lib/prisma-client";
import { CHAT_ROOM_STATUS } from "@/types";
import { v4 as uuid } from "uuid";

export async function getOrCreateChatRoom(args: { currentUserId: string | undefined; targetUserId: string }) {
  if (!args.currentUserId) {
    throw new Error(NO_TARGET_USER_FOR_CHAT);
  }

  const chatRoomId = await prismaClient.$transaction(async (tx) => {
    const existChat = await tx.chat_rooms.findFirst({
      where: {
        AND: [
          {
            chat_rooms_users__links: {
              some: {
                userId: +args.currentUserId!,
              },
            },
          },
          {
            chat_rooms_users__links: {
              some: {
                userId: +args.targetUserId!,
              },
            },
          },
        ],
      },
    });

    if (existChat) {
      return existChat?.id;
    }

    const newChatRoom = await tx.chat_rooms.create({
      data: {
        id: uuid(),
        status: CHAT_ROOM_STATUS.open,
        chat_rooms_users__links: {
          createMany: {
            data: [
              {
                userId: +args.currentUserId!,
              },
              {
                userId: +args.targetUserId,
              },
            ],
          },
        },
      },
    });
    return newChatRoom.id;
  });

  return { chatRoomId };
}
