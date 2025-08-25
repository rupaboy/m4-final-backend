import axios from "axios";

export const getCapitalImage = async (capitalName) => {
  try {
    const baseUrl = process.env.WIKI_API_URL;
    const res = await axios.get(`${baseUrl}/${encodeURIComponent(capitalName)}`);

    return res.data.thumbnail?.source || null;
  } catch (err) {
    throw new Error(err?.response?.statusText || err.message);
  }
};