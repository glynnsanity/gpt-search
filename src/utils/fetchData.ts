export const fetchData = async (endpoint: string, bodyContent: object) => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyContent),
  });
  if (!response.ok) throw new Error(response.statusText);
  return response.json();
};