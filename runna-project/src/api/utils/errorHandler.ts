export const handleApiError = (error: any, endpoint: string): void => {
    if (error.response) {
      console.error(`API Error - ${endpoint}:`, {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else {
      console.error(`API Error - ${endpoint}:`, error.message);
    }
  };
  