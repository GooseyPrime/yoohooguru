/**
 * Calendar Utilities
 * Helper functions for calendar integration (ICS export, Google Calendar links)
 */

/**
 * Format date for ICS format (YYYYMMDDTHHMMSSZ)
 * @param {Date} date - Date to format
 * @returns {string} ICS formatted date string
 */
function formatICSDate(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generate ICS calendar file content for a session
 * @param {Object} session - Session object
 * @param {Object} options - Additional options
 * @returns {string} ICS file content
 */
function generateICS(session, options = {}) {
  const startDate = new Date(session.startTime);
  const endDate = new Date(session.endTime);
  
  const title = options.title || `${session.mode.toUpperCase()} Session`;
  const description = options.description || `Distance learning session in ${session.mode} mode`;
  const location = session.joinUrl || options.location || '';
  const url = session.joinUrl || options.url || '';
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//yoohoo.guru//Modified Masters//EN',
    'BEGIN:VEVENT',
    `UID:session-${session.id}@yoohoo.guru`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${title}`,
    description ? `DESCRIPTION:${description}` : '',
    url ? `URL:${url}` : '',
    location ? `LOCATION:${location}` : '',
    'STATUS:TENTATIVE',
    `CREATED:${formatICSDate(new Date(session.createdAt))}`,
    `LAST-MODIFIED:${formatICSDate(new Date(session.updatedAt || session.createdAt))}`,
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');
  
  return icsContent;
}

/**
 * Generate Google Calendar link for a session
 * @param {Object} session - Session object
 * @param {Object} options - Additional options
 * @returns {string} Google Calendar URL
 */
function googleCalendarLink(session, options = {}) {
  const startDate = new Date(session.startTime);
  const endDate = new Date(session.endTime);
  
  const formatGoogleDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const title = options.title || `${session.mode.toUpperCase()} Session`;
  const details = options.details || `Distance learning session in ${session.mode} mode`;
  const location = session.joinUrl || options.location || '';
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    details: details,
    location: location
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Outlook/Office 365 calendar link
 * @param {Object} session - Session object
 * @param {Object} options - Additional options
 * @returns {string} Outlook calendar URL
 */
function outlookCalendarLink(session, options = {}) {
  const startDate = new Date(session.startTime);
  const endDate = new Date(session.endTime);
  
  const title = options.title || `${session.mode.toUpperCase()} Session`;
  const body = options.details || `Distance learning session in ${session.mode} mode`;
  const location = session.joinUrl || options.location || '';
  
  const params = new URLSearchParams({
    subject: title,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: body,
    location: location,
    path: '/calendar/action/compose',
    rru: 'addevent'
  });
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generate all calendar links for a session
 * @param {Object} session - Session object
 * @param {Object} options - Additional options
 * @returns {Object} Object with all calendar links
 */
function generateAllCalendarLinks(session, options = {}) {
  return {
    ics: generateICS(session, options),
    google: googleCalendarLink(session, options),
    outlook: outlookCalendarLink(session, options)
  };
}

/**
 * Format session duration in human readable format
 * @param {Object} session - Session object
 * @returns {string} Formatted duration
 */
function formatSessionDuration(session) {
  const durationMs = session.endTime - session.startTime;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

/**
 * Format local date and time for display
 * @param {number} timestamp - Epoch timestamp
 * @param {string} locale - Locale string (default: 'en-US')
 * @param {string} timezone - Timezone (default: user's local timezone)
 * @returns {string} Formatted date and time
 */
function formatLocalDateTime(timestamp, locale = 'en-US', timezone = undefined) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone
  }).format(date);
}

module.exports = {
  generateICS,
  googleCalendarLink,
  outlookCalendarLink,
  generateAllCalendarLinks,
  formatSessionDuration,
  formatLocalDateTime,
  formatICSDate
};