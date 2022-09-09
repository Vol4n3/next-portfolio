// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as Process from "process";
import { Cercle } from "../../../features/notion/notion-api-type";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Cercle[] | null>
) {
  if (req.method === "GET") {
    fetch(
      "https://api.notion.com/v1/databases/fbdad3da977b40c6a2d2d17e5a559f66/query",
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
            name: result["properties"]["Cercles"]["title"][0]["plain_text"],
            roles: result["properties"]["Rôles"]["relation"].map(
              (role: any) => role.id
            ),
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
