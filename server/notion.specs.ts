import { Client } from "@notionhq/client";

// Initializing a client
const notion = new Client({
  auth: "secret_7pHblDwDjD3YwRXSVFwt3CdDT5u0eW4eB3WeT8GBKxs",
});

test("get notion", async () => {
  const myPage = await notion.databases.query({
    database_id: "12d5c65f0aa24d80a5ccef7aeb74f609",
  });
  console.log(myPage);
});
