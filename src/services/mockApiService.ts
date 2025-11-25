async function fetchMockDataFile(filePath: string): Promise<unknown> {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Mock API Error: Failed to load ${filePath} (${response.status})`);
  }
  return response.json();
}

export async function getMetadata<T = string[]>(filePath: string): Promise<T> {
  return (await fetchMockDataFile(filePath)) as T;
}

