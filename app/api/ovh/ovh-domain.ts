import * as crypto from "crypto";
import { exec } from "child_process";
export const subDomainRecord = async ({
  domainName = "volan.fr",
  subDomain,
}: {
  subDomain: string;
  domainName?: string;
}) => {
  const email = "jcvolan@gmail.com";
  const targetIP = "164.132.200.180";
  const appKey = process.env.OVH_KEY || "";
  const appSecret = process.env.OVH_SECRET || "";
  const consumerKey = "your_consumer_key";

  const method = "POST";
  const url = `https://eu.api.ovh.com/1.0/domain/zone/${domainName}/record`;
  const body = JSON.stringify({
    fieldType: "A",
    subDomain: subDomain,
    target: targetIP,
  });

  const now = Math.floor(new Date().getTime() / 1000).toString();

  // Signature
  const signature = crypto
    .createHmac("sha1", appSecret)
    .update(`${appKey}+${consumerKey}+${method}+${url}+${body}+${now}`)
    .digest("hex");

  // Requête
  await fetch(url, {
    method: method,
    body: body,
    headers: {
      "Content-type": "application/json",
      "X-Ovh-Application": appKey,
      "X-Ovh-Consumer": consumerKey,
      "X-Ovh-Signature": `$1$${signature}`,
      "X-Ovh-Timestamp": now,
    },
  }).then((response) => response.json());

  const certbotCommand = `sudo certbot --nginx --non-interactive --agree-tos --email ${email} -d ${subDomain}.${domainName} -d www.${subDomain}.${domainName}`;
  exec(certbotCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }

    console.log(`Output: ${stdout}`);
  });
};
