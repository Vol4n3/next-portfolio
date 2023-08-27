export const badRequest = (message: string) => {
  return new Response(message, {
    status: 400,
  });
};
export const notFound = () => {
  return new Response("Not found", {
    status: 404,
  });
};
