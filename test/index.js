import express from "express";
import { PNG } from "pngjs";
import { lightningChart, renderToPNG } from "@lightningchart/lcjs-headless";
import { flatThemeLight } from "@lightningchart/lcjs-themes";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const lc = lightningChart({
    // Valid until 8/6/2024
    license:
      "0002-n6Q3wipxRCPK7PHm1Z1p6PdhNNqeKwClN/s+aUwl3vT54A0lse0e9Ryv9JY4YzR8avVBVjTpcgbR7Q8DS2egZAHn-MEUCIQC87Etz4Jn4NLyctnrTCjVOHKsy7VSxa99DG6arbb1RfgIgZKtGhZpmATUsBZ6fkq834+Sq137gFyv7lsz3OVndGvA=",
    licenseInformation: {
      appTitle: "LightningChart JS Trial",
      company: "LightningChart Ltd.",
    },
  });
  const chart = lc.ChartXY({ theme: flatThemeLight });
  const chartOutput = renderToPNG(chart, 800, 640);
  const outputBuff = PNG.sync.write(chartOutput);
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Length", outputBuff.length);
  res.send(outputBuff);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
