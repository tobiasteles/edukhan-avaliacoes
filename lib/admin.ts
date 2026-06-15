import { auth } from "@clerk/nextjs/server";

const adminIds = [
  "user_37UdggT9NxfKCEdpDJ0bIpmcYbw",
  "user_3B5xJWQ0MleZXmnEPyiUuvtO0ka",
  "user_39a6wm9NORCQPTpD9CVmCEX27R3",
  "user_3BduBaVYwsgkctuAzatWgxcrp7V",
  "user_3CJGbtilZ5sk41HIhuDVUJ8sgNb",
  "user_3CV2R2trJ4JmvFuZ8lzHs4Vjub6",
];

export const getIsAdmin = async () => {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  return adminIds.indexOf(userId) !== -1;
};
