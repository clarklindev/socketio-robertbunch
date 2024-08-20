let cachedNamespaces = null;

async function fetchNamespaces() {
  if (cachedNamespaces) {
    return cachedNamespaces;
  }

  try{
    const apiUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}/api/socket/namespaces`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    cachedNamespaces = await response.json();
    return cachedNamespaces;
  }
  catch (error) {
    console.error('Failed to fetch namespaces:', error);
    // Handle error appropriately, possibly return a default value or rethrow
    return [];
  }

 
 
}

export { fetchNamespaces };
