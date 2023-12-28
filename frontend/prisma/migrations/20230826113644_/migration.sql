-- CreateTable
CREATE TABLE "chat_rooms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "variant" TEXT,
    "status" TEXT,
    "title" TEXT,

    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_rooms_users__link" (
    "userId" TEXT NOT NULL,
    "chatRoomId" UUID NOT NULL,

    CONSTRAINT "chat_rooms_users__link_pkey" PRIMARY KEY ("userId","chatRoomId")
);

-- CreateTable
CREATE TABLE "chat_message" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "status" TEXT,
    "variant" TEXT,
    "text" TEXT,
    "author_user_id" UUID NOT NULL,
    "chat_room_id" UUID NOT NULL,

    CONSTRAINT "chat_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages_read" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "user_id" UUID NOT NULL,
    "chat_room_id" UUID NOT NULL,
    "last_read_message_id" UUID NOT NULL,

    CONSTRAINT "messages_read_pkey" PRIMARY KEY ("user_id","chat_room_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_rooms_id_key" ON "chat_rooms"("id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_message_id_key" ON "chat_message"("id");

-- AddForeignKey
ALTER TABLE "chat_rooms_users__link" ADD CONSTRAINT "chat_rooms_users__link_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "chat_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "chat_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages_read" ADD CONSTRAINT "messages_read_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "chat_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
