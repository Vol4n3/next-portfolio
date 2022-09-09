// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as Process from "process";
import { Role } from "../../../features/notion/notion-api-type";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Role[] | null>
) {
  if (req.method === "GET") {
    fetch(
      "https://api.notion.com/v1/databases/ee5d0dcb19744ecd86d0d871ca6826af/query",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Process.env.NOTION_SECRET}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      }
    )
      .then((blob) => blob.json())
      .then((response) =>
        res.status(200).json(
          response.results.map((result: any) => ({
            name: result["properties"]["Rôles"]["title"][0]["plain_text"],
            icon: result.icon,
            id: result.id,
          }))
        )
      )
      .catch((error) => res.status(500).send(error));

    return;
  }

  res.status(404).send(null);
}
