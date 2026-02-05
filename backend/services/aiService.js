import axios from "axios";

const AI_BASE_URL = "http://localhost:5002";

// 🔹 Call Flask: generate altNames
export async function generateAltNamesAI(data) {
  const res = await axios.post(
    `${AI_BASE_URL}/generate_altnames`,
    {
      name: data.name,
      main_category: data.main_category,
      color: data.color,
      country: data.country
    }
  );

  return res.data.altNames;
}

// 🔹 Call Flask: generate description
export async function generateDescriptionAI(data) {
  const res = await axios.post(
    `${AI_BASE_URL}/generate_description`,
    {
      name: data.name,
      main_category: data.main_category,
      price: data.price,
      color: data.color,
      country: data.country
    }
  );

  return res.data.description;
}
