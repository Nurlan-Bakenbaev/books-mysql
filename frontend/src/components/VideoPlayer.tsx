import { useEffect, useId, useState } from 'react';
import type { FormEvent } from 'react';
import { FiExternalLink, FiPlay, FiTrash2, FiYoutube } from 'react-icons/fi';

type Bookmark = { id: string; label: string; seconds: number };
type SavedVideo = { videoId: string; bookmarks: Bookmark[] };
export type VideoPlayerProps = { topicId: string; queriesRu: string[]; queriesEn: string[] };

const storagePrefix = 'sysadmin-course-video:';
const videoIdPattern = /^[A-Za-z0-9_-]{11}$/;

function parseVideoId(value: string): string | null {
  const input = value.trim();
  if (videoIdPattern.test(input)) return input;
  try {
    const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    const host = url.hostname.toLowerCase();
    const parts = url.pathname.split('/').filter(Boolean);
    let candidate: string | null = null;
    if (host === 'youtu.be' || host === 'www.youtu.be') candidate = parts[0] || null;
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      candidate = url.pathname === '/watch' ? url.searchParams.get('v') : ['embed', 'shorts', 'live'].includes(parts[0]) ? parts[1] || null : null;
    }
    return candidate && videoIdPattern.test(candidate) ? candidate : null;
  } catch { return null; }
}

function readSaved(topicId: string): SavedVideo {
  const empty: SavedVideo = { videoId: '', bookmarks: [] };
  try {
    const value = JSON.parse(localStorage.getItem(storagePrefix + topicId) || 'null');
    if (!value || !videoIdPattern.test(value.videoId)) return empty;
    const bookmarks = Array.isArray(value.bookmarks) ? value.bookmarks.filter((entry: unknown): entry is Bookmark => {
      if (!entry || typeof entry !== 'object') return false;
      const item = entry as Partial<Bookmark>;
      return typeof item.id === 'string' && typeof item.label === 'string' && Number.isSafeInteger(item.seconds) && (item.seconds as number) >= 0;
    }) : [];
    return { videoId: value.videoId, bookmarks };
  } catch { return empty; }
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
    : `${minutes}:${String(remainder).padStart(2, '0')}`;
}

export default function VideoPlayer({ topicId, queriesRu, queriesEn }: VideoPlayerProps) {
  const uid = useId();
  const [saved, setSaved] = useState<SavedVideo>(() => readSaved(topicId));
  const [url, setUrl] = useState(() => readSaved(topicId).videoId);
  const [label, setLabel] = useState('');
  const [seconds, setSeconds] = useState('');
  const [notice, setNotice] = useState('');
  const [playback, setPlayback] = useState({ start: 0, revision: 0, autoplay: false });

  useEffect(() => {
    const next = readSaved(topicId);
    setSaved(next);
    setUrl(next.videoId);
    setLabel('');
    setSeconds('');
    setNotice('');
    setPlayback({ start: 0, revision: 0, autoplay: false });
  }, [topicId]);

  function persist(next: SavedVideo) {
    setSaved(next);
    try { localStorage.setItem(storagePrefix + topicId, JSON.stringify(next)); }
    catch { setNotice('Не удалось сохранить изменения в браузере: они доступны до закрытия страницы.'); }
  }

  function addVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = parseVideoId(url);
    if (!id) {
      setNotice('Вставьте ссылку на конкретное видео YouTube или его идентификатор из 11 символов.');
      return;
    }
    setNotice('');
    const same = id === saved.videoId;
    persist({ videoId: id, bookmarks: same ? saved.bookmarks : [] });
    setUrl(id);
    setPlayback((current) => ({ start: 0, revision: current.revision + 1, autoplay: false }));
    setLabel('');
    setSeconds('');
  }

  function addBookmark(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const time = Number(seconds);
    const trimmed = label.trim();
    if (!trimmed || !Number.isSafeInteger(time) || time < 0 || time > 8640000 || seconds.trim() === '') {
      setNotice('Укажите название и целое число секунд от 0 до 8640000.');
      return;
    }
    setNotice('');
    const bookmark: Bookmark = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, label: trimmed, seconds: time };
    persist({ ...saved, bookmarks: [...saved.bookmarks, bookmark].sort((a, b) => a.seconds - b.seconds) });
    setLabel('');
    setSeconds('');
  }

  function removeBookmark(id: string) {
    setNotice('');
    persist({ ...saved, bookmarks: saved.bookmarks.filter((bookmark) => bookmark.id !== id) });
  }

  const groups = [{ label: 'На русском', queries: queriesRu }, { label: 'In English', queries: queriesEn }];
  return <section className="video-section" aria-labelledby={`${uid}-heading`}>
    <div className="video-heading"><FiYoutube aria-hidden="true" /><div><h3 id={`${uid}-heading`}>Видео по теме</h3><p>Найдите подходящий ролик, добавьте ссылку и сохраните собственные таймкоды.</p></div></div>
    <div className="video-search-groups">{groups.map((group) => <div className="video-search-group" key={group.label}>
      <strong>{group.label}</strong><ul>{group.queries.map((query) => <li key={query}><a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer">{query} <FiExternalLink aria-hidden="true" /><span className="sr-only"> (откроется в новой вкладке)</span></a></li>)}</ul>
    </div>)}</div>
    <form className="video-form" onSubmit={addVideo}>
      <label htmlFor={`${uid}-url`}>Ссылка на видео или его ID</label>
      <div className="video-form-row"><input id={`${uid}-url`} type="text" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." autoComplete="off" /><button className="button" type="submit">Открыть видео</button></div>
    </form>
    <p className="video-note">Ролик загружается с YouTube после добавления ссылки. Доступность видео зависит от его автора и настроек YouTube.</p>
    {notice && <p className="video-notice" role="status">{notice}</p>}
    {saved.videoId ? <>
      <div className="video-frame"><iframe key={`${saved.videoId}-${playback.revision}`} title="Выбранное видео YouTube" src={`https://www.youtube-nocookie.com/embed/${saved.videoId}?start=${playback.start}&rel=0${playback.autoplay ? '&autoplay=1' : ''}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
      <div className="video-bookmarks"><h4>Мои таймкоды</h4><p>Добавьте свои заметки по ролику: время указывается в секундах.</p>
        <form className="video-bookmark-form" onSubmit={addBookmark}>
          <label htmlFor={`${uid}-label`}>Название<input id={`${uid}-label`} value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Например: настройка DNS" maxLength={120} required /></label>
          <label htmlFor={`${uid}-seconds`}>Время, сек.<input id={`${uid}-seconds`} type="number" min="0" max="8640000" step="1" value={seconds} onChange={(event) => setSeconds(event.target.value)} placeholder="120" required /></label>
          <button className="button" type="submit">Добавить</button>
        </form>
        {saved.bookmarks.length > 0 ? <ul className="video-bookmark-list">{saved.bookmarks.map((bookmark) => <li key={bookmark.id}><button type="button" className="video-bookmark-play" onClick={() => setPlayback((current) => ({ start: bookmark.seconds, revision: current.revision + 1, autoplay: true }))}><FiPlay aria-hidden="true" /> <span>{formatTime(bookmark.seconds)}</span> {bookmark.label}</button><button type="button" className="video-bookmark-remove" aria-label={`Удалить таймкод ${bookmark.label}`} onClick={() => removeBookmark(bookmark.id)}><FiTrash2 aria-hidden="true" /></button></li>)}</ul> : <p className="video-empty">Таймкодов пока нет. Их можно добавить после просмотра видео.</p>}
        <p className="video-note">Ссылка и ваши таймкоды сохраняются в браузере на этом устройстве.</p>
      </div>
    </> : <div className="video-empty">Видео пока не выбрано. Используйте поиск выше и вставьте ссылку на подходящий ролик.</div>}
  </section>;
}
