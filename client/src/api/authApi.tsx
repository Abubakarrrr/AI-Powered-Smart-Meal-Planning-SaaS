const API_URL = "http://localhost:3000/api/auth";

export const signup = async (body: any) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Error signing up. Please try again.");
  }

  return response.json();
};
