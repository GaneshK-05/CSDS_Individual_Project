export const getTimeRemaining = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate - now;

  if (diff <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
      text: 'Deadline passed'
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  let text = '';
  if (days > 0) {
    text = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    text = `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    text = `${minutes}m ${seconds}s`;
  } else {
    text = `${seconds}s`;
  }

  return {
    total: diff,
    days,
    hours,
    minutes,
    seconds,
    expired: false,
    text
  };
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
};

export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const getTaskStatus = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate - now;

  if (diff <= 0) {
    return 'Deadline Passed';
  } else if (diff <= 24 * 60 * 60 * 1000) {
    return 'Due Today';
  } else if (diff <= 3 * 24 * 60 * 60 * 1000) {
    return 'Due Soon';
  } else {
    return 'Upcoming';
  }
};
