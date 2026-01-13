type methodType = "GET" | "POST" | "PUT" | "DELETE";
type optionsType = {
    method?: methodType,
    headers?: HeadersInit,
    body?: {} | null
}

const API_BASE_URL = "http://localhost:3000";

export default async function useFetch(
    url: string,
    options?: optionsType
) {
    const {
        method = "GET",
        headers = { "Content-Type": "application/json" },
        body = null
    } = options || {} as optionsType;
    const
        requestUrl = API_BASE_URL + url,
        response = await fetch(requestUrl, {
            method, headers, ...(method === "POST" && { body: JSON.stringify({ body }) })
        });

    if (!response.ok) throw Error("Faild to fetch.");

    return await response.json();
}


