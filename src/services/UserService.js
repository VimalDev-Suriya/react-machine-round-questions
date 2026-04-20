import { FAKE_STORE_API_BASE_URL } from "../env";

export class UserService {
    constructor() { }

    async getUsers() {
        const unserializedData = await fetch(`${FAKE_STORE_API_BASE_URL}/users`);

        return await unserializedData.json()
    }
}