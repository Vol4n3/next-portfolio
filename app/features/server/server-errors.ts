export const badRequest = (message: string) => {
  return new Response("Bad Request", {
    status: 400,
    statusText: `${message}`,
  });
};
export const notFound = () => {
  return new Response("Not found", {
    status: 404,
    statusText: `not found`,
  });
};
