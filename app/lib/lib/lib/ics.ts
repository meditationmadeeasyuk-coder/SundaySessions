export function buildICS(evt: {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  location?: string;
  description?: string;
}) {
  const dt = (s: string) => new Date(s).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const now = dt(new Date().toISOString());
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SundaySessions//EN',
    'BEGIN:VEVENT',
    `UID:${evt.id}@sundaysessions`,
    `DTSTAMP:${now}`,
    `DTSTART:${dt(evt.starts_at)}`,
    `DTEND:${dt(evt.ends_at)}`,
    `SUMMARY:${escapeText(evt.title)}`,
    evt.location ? `LOCATION:${escapeText(evt.location)}` : '',
    evt.description ? `DESCRIPTION:${escapeText(evt.description)}` : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');
}
function escapeText(s: string) {
  return s.replace(/[\n,;]/g, ch => ({'\n':'\\n', ',':'\\,',';':'\\;'}[ch as any] as string));
}
