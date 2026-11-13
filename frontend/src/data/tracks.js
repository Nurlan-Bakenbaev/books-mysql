// Central metadata for lesson "tracks" (courses). LessonPage and navigation read
// from this single map instead of hardcoding a chain of ternaries per track.
const trackMeta = {
  'network-engineer': { hash: '#network-engineer', label: 'NETWORK ENGINEER', back: 'К курсу сетевого инженера' },
  'windows-security': { hash: '#windows-security', label: 'БЕЗОПАСНОСТЬ WINDOWS', back: 'К курсу безопасности Windows' },
  'azure-admin': { hash: '#azure-admin', label: 'AZ-104 · ADMINISTRATOR AZURE', back: 'К курсу AZ-104' },
  'linux-security': { hash: '#linux-security', label: 'БЕЗОПАСНОСТЬ LINUX', back: 'К курсу безопасности Linux' },
  'ethical-hacking': { hash: '#ethical-hacking', label: 'ЭТИЧНЫЙ ХАКИНГ', back: 'К курсу этичного хакинга' },
  'security-plus': { hash: '#security-plus', label: 'COMPTIA SECURITY+ · SY0-701', back: 'К курсу Security+' },
  'computer-technologies': { hash: '#computer-technologies', label: 'ФУНДАМЕНТАЛЬНЫЙ COMPUTER SCIENCE', back: 'К курсу Computer Science' },
};

const defaultTrackMeta = { hash: '#roadmap', label: 'ДОРОЖНАЯ КАРТА', back: 'К дорожной карте' };

export function getTrackMeta(track) {
  return trackMeta[track] || defaultTrackMeta;
}
