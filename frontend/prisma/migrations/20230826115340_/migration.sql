/*
  Warnings:

  - The primary key for the `messages_read` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "chat_message" ALTER COLUMN "author_user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "messages_read" DROP CONSTRAINT "messages_read_pkey",
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "messages_read_pkey" PRIMARY KEY ("user_id", "chat_room_id");
