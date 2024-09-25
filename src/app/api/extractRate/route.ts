import axios from "axios";
import { load } from "cheerio";
import { NextResponse } from "next/server";

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
}

export async function GET() {
  try {
    const { data } = await axios.get(
      "https://www.rate.am/hy/armenian-dram-exchange-rates/banks",
    );
    const $ = load(data);
    let usd = "";
    let rur = "";

    const ameriaLinkElement = $('a[href="/hy/bank/ameriabank"]');
    const parent = ameriaLinkElement?.parent()?.parent()?.parent();

    let targetIndex = -1;
    parent?.children()?.each((index, div) => {
      const anchor = $(div).find('a[href="/hy/bank/ameriabank"]');
      if (anchor.length) {
        targetIndex = index;
      }
    });

    if (targetIndex > -1) {
      const valuesParent = parent
        ?.parent()
        ?.next()
        ?.children()
        ?.eq(0)
        ?.children()
        ?.eq(2);

      const valueRow = valuesParent?.children()?.eq(targetIndex);
      usd = valueRow?.children()?.eq(0)?.children()?.eq(1)?.text();
      rur = valueRow?.children()?.eq(2)?.children()?.eq(1)?.text();
    }

    const response = NextResponse.json({ usd, rur }, { status: 200 });
    setCorsHeaders(response);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: "Failed to fetch or parse the website" },
      { status: 500 },
    );
    setCorsHeaders(response);
    return response;
  }
}
