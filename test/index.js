const express = require("express");
const { PNG } = require("pngjs");
const {
  lightningChart,
  renderToPNG,
} = require("@lightningchart/lcjs-headless");
const { flatThemeLight } = require("@lightningchart/lcjs-themes");
const { ColorRGBA, SolidFill } = require("@lightningchart/lcjs");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const lc = lightningChart({});
  const chart = lc.ChartXY({ theme: flatThemeLight });
  chart.setSeriesBackgroundFillStyle(
    new SolidFill({ color: ColorRGBA(255, 0, 0) })
  );
  const chartOutput = renderToPNG(chart, 800, 640);
  const outputBuff = PNG.sync.write(chartOutput);
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Length", outputBuff.length);
  res.send(outputBuff);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
