const YBoundMax = 9;
const XBoundMax = 9;
const YBoundMin = 0;
const XBoundMin = 0;

export const getBorderIds = (id) => {
  const [Y, X] = id.split('.');
  const y = +Y;
  const x = +X;
  const ids = [];

  //Top
  const YTop = y - 1;
  if (YTop >= YBoundMin) {
    ids.push(`${YTop}.${x}`);
  }

  //Top Left
  const YTopLeft = y - 1;
  const XTopLeft = x - 1;
  if (YTopLeft >= YBoundMin && XTopLeft >= XBoundMin) {
    ids.push(`${YTopLeft}.${XTopLeft}`);
  }

  // Left
  const XLeft = x - 1;
  if (XLeft >= XBoundMin) {
    ids.push(`${y}.${XLeft}`);
  }

  //Top Right
  const YTopRight = y - 1;
  const XTopRight = x + 1;
  if (YTopRight >= YBoundMin && XTopRight <= XBoundMax) {
    ids.push(`${YTopRight}.${XTopRight}`);
  }

  //Right
  const XRight = x + 1;
  if (XRight <= XBoundMax) {
    ids.push(`${y}.${XRight}`);
  }

  //Bottom
  const YBottom = y + 1;
  if (YBottom <= YBoundMax) {
    ids.push(`${YBottom}.${x}`);
  }

  //Bottom Left
  const YBottomLeft = y + 1;
  const XBottomLeft = x - 1;
  if (YBottomLeft <= YBoundMax && XBottomLeft >= XBoundMin) {
    ids.push(`${YBottomLeft}.${XBottomLeft}`);
  }

  //Bottom Right
  const YBottomRight = y + 1;
  const XBottomRight = x + 1;
  if (YBottomRight <= YBoundMax && XBottomRight <= XBoundMax) {
    ids.push(`${YBottomRight}.${XBottomRight}`);
  }

  return ids;
};
