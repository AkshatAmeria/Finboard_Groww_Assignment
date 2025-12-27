export const fetchFinanceData = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('API fetch error:', error);
    throw new Error(error.message || 'Failed to fetch data');
  }
};
