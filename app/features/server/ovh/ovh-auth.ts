type OvhToken = {
  consumerKey: string;
  validationUrl: string;
  state: "pendingValidation" | string;
};
export async function getOvhToken() {
  const appKey = process.env.OVH_KEY || "";
  const url = "https://eu.api.ovh.com/1.0/auth/credential";
  const now = Math.floor(new Date().getTime() / 1000).toString();
  const body = {
    accessRules: [
      { method: "GET", path: "/*" },
      { method: "POST", path: "/*" },
      { method: "PUT", path: "/*" },
      { method: "DELETE", path: "/*" },
    ],
  };
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "x-ovh-application": appKey,
      "x-ovh-timestamp": now,
    },
    body: JSON.stringify(body),
    method: "POST",
  });
  return response.json();
}
