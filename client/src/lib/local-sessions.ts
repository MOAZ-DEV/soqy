type key = "cart_id";

export default function useLocalSessions() {
    if (typeof window === "undefined")
        return null;
    else
        return {
            set: ({ key, data }: { key: key, data: string }) =>
                localStorage.setItem(key, data),
            get: ({ key }: { key: key }) =>
                localStorage.getItem(key)
        }
}