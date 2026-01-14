import { auth } from "@clerk/nextjs/server";

const adminIds = [
    "user_37UdggT9NxfKCEdpDJ0bIpmcYbw"
]

export const getIsAdmin = async () => {
    const { userId } = await auth();

    if (!userId) {
        return false;
    }

    return adminIds.indexOf(userId) !== -1;
}