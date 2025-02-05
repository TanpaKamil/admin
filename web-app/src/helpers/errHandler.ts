export function errHandler(error: any) {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  return new Response(
    JSON.stringify({ message }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}