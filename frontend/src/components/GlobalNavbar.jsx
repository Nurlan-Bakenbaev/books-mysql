const links = [['career-map', 'Карта'], ['careers', 'Профессии'], ['courses', 'Курсы'], ['resources', 'Библиотека'], ['labs', 'Практика'], ['certifications', 'Сертификации'], ['overview', 'Обзор']];
export default function GlobalNavbar() {
  return <nav className="global-navbar" aria-label="Разделы платформы">{links.map(([id, title]) => <a key={id} href={`?view=${id}`} data-route-link>{title}</a>)}</nav>;
}
