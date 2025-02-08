import { currentUser } from "@clerk/nextjs/server";

export const isAuthorized = async () => {
    const user = await currentUser();
    if (user?.publicMetadata.role !== "admin") {
        return false;
    }
    return true;
    }