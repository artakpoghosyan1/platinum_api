import axios from "axios";
import { load } from "cheerio";
import { NextResponse } from "next/server";

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

    return NextResponse.json({ usd, rur }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch or parse the website" },
      { status: 500 },
    );
  }
}
