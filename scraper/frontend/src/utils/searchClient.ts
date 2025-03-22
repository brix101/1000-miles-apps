import algoliasearch from "algoliasearch/lite";

const appId = import.meta.env.VITE_ALGOLIA_APPID;
const apiKey = import.meta.env.VITE_ALGOLIA_API_KEY;

const client = algoliasearch(appId, apiKey);

export const productIndex = client.initIndex("sc_products");

export default client;
