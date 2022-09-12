import axios from "axios";

export const search = async (query: string) => {
  const { data, status } = await axios.get<any>(
    `https://a3qc77koo0.execute-api.us-east-1.amazonaws.com/dev/items/query?query=${query}`
  );

  if (status === 200) {
    console.log(data["ResultItems"]);
    return data["ResultItems"];
  } else {
    console.log("error", status);
    return [];
  }
};
