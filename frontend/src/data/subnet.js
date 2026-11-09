function parseAddress(address) {
  const parts = address.split('.');
  if (parts.length !== 4 || parts.some((part) => !/^(0|[1-9]\d{0,2})$/.test(part) || Number(part) > 255)) {
    throw new Error('Введите IPv4 из четырёх чисел от 0 до 255 без ведущих нулей.');
  }
  return parts.reduce((value, part) => ((value << 8) | Number(part)) >>> 0, 0);
}

function formatAddress(value) {
  return [value >>> 24, (value >>> 16) & 255, (value >>> 8) & 255, value & 255].join('.');
}

export function calculateSubnet(address, prefixText) {
  const value = parseAddress(address.trim());
  if (!/^(0|[1-9]\d?)$/.test(prefixText) || Number(prefixText) > 32) {
    throw new Error('Введите длину префикса от 0 до 32.');
  }
  const prefix = Number(prefixText);
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (value & mask) >>> 0;
  const broadcast = (network | ~mask) >>> 0;
  const pointToPoint = prefix >= 31;
  const total = 2 ** (32 - prefix);
  return {
    network: `${formatAddress(network)}/${prefix}`,
    mask: formatAddress(mask),
    broadcast: formatAddress(broadcast),
    firstHost: formatAddress(pointToPoint ? network : network + 1),
    lastHost: formatAddress(pointToPoint ? broadcast : broadcast - 1),
    usableHosts: pointToPoint ? total : total - 2,
    prefix,
  };
}
