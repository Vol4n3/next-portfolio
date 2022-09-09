// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as Process from "process";
import { Hellipsien } from "../../../features/notion/notion-api-type";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hellipsien[] | null>
) {
  if (req.method === "GET") {
    fetch(
      "https://api.notion.com/v1/databases/a8189d8ca8cb45d085c3422f5158fb9b/query",
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
          response.results.map((result: any) => {
            const firstFile = result["properties"]["Avatar"]["files"][0];
            return {
              name: result["properties"]["Name"]["title"][0]["plain_text"],
              roles: result["properties"]["Rôles"]["relation"].map(
                (role: any) => role.id
              ),
              avatar: firstFile?.file.url,
              id: result.id,
            };
          })
        )
      )
      .catch((error) => res.status(500).send(error));

    return;
  }

  res.status(404).send(null);
}
