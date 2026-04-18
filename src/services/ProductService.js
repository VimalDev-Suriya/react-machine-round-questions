import { FAKE_STORE_API_BASE_URL } from "../env";

export class ProductService {
  constructor() {}

  async getProducts() {
    const unserializedData = await fetch(`${FAKE_STORE_API_BASE_URL}/products`);

    return await unserializedData.json();
  }
}
