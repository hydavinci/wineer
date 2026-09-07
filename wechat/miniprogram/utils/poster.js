function buildPosterModel(ranked) {
  return {
    title: "Wineer 白酒推荐",
    subtitle: `按当前偏好推荐 ${Math.min(ranked.length, 3)} 款白酒`,
    wines: ranked.slice(0, 3).map(({ item, rankLabel }, index) => ({
      id: item.id,
      rank: index + 1,
      name: item.name,
      details: `${item.aroma}型 · ${item.abv}度 · 参考价 ¥${item.price}`,
      rankLabel
    })),
    sharePrompt: "请用小程序卡片分享，朋友可直接打开结果",
    disclaimer: "规格、价格请核实，非实时报价。请理性饮酒。"
  };
}

function roundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function wrapText(context, text, maxWidth, maxLines = 2) {
  const characters = Array.from(String(text));
  const lines = [];
  let line = "";

  characters.forEach(character => {
    const candidate = `${line}${character}`;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = character;
      return;
    }
    line = candidate;
  });

  if (line) {
    lines.push(line);
  }

  if (lines.length <= maxLines) {
    return lines;
  }

  const visible = lines.slice(0, maxLines);
  let lastLine = visible[maxLines - 1];
  while (lastLine && context.measureText(`${lastLine}…`).width > maxWidth) {
    lastLine = lastLine.slice(0, -1);
  }
  visible[maxLines - 1] = `${lastLine}…`;
  return visible;
}

function drawPoster(canvas, width, height, model) {
  const context = canvas.getContext("2d");
  const horizontalPadding = width * 0.08;
  const cardWidth = width - horizontalPadding * 2;
  const cardHeight = height * 0.18;
  const cardGap = height * 0.025;
  const firstCardY = height * 0.25;

  context.fillStyle = "#f7f6f2";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "#242722";
  context.font = `bold ${Math.round(width * 0.065)}px sans-serif`;
  context.fillText(model.title, horizontalPadding, height * 0.095);

  context.fillStyle = "#696c65";
  context.font = `${Math.round(width * 0.035)}px sans-serif`;
  context.fillText(model.subtitle, horizontalPadding, height * 0.15);

  model.wines.forEach((wine, index) => {
    const cardY = firstCardY + index * (cardHeight + cardGap);
    roundedRect(context, horizontalPadding, cardY, cardWidth, cardHeight, width * 0.025);
    context.fillStyle = "#ffffff";
    context.fill();

    context.fillStyle = "#80603a";
    context.font = `bold ${Math.round(width * 0.035)}px sans-serif`;
    context.fillText(`TOP ${wine.rank}`, horizontalPadding + width * 0.035, cardY + cardHeight * 0.25);

    context.fillStyle = "#242722";
    context.font = `bold ${Math.round(width * 0.043)}px sans-serif`;
    const nameX = horizontalPadding + width * 0.035;
    const nameY = cardY + cardHeight * 0.5;
    wrapText(context, wine.name, cardWidth * 0.66, 2).forEach((line, lineIndex) => {
      context.fillText(line, nameX, nameY + lineIndex * width * 0.052);
    });

    context.fillStyle = "#696c65";
    context.font = `${Math.round(width * 0.027)}px sans-serif`;
    context.fillText(wine.details, nameX, cardY + cardHeight * 0.85);

    context.fillStyle = "#80603a";
    context.font = `bold ${Math.round(width * 0.033)}px sans-serif`;
    context.fillText(wine.rankLabel, horizontalPadding + cardWidth * 0.76, cardY + cardHeight * 0.52);
  });

  context.fillStyle = "#696c65";
  context.font = `bold ${Math.round(width * 0.029)}px sans-serif`;
  context.fillText(model.sharePrompt, horizontalPadding, height * 0.89);

  context.fillStyle = "#696c65";
  context.font = `${Math.round(width * 0.026)}px sans-serif`;
  context.fillText(model.disclaimer, horizontalPadding, height * 0.94);
}

module.exports = {
  buildPosterModel,
  drawPoster
};
