const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return 'Just now';
  }
  const date = timestamp.toDate();
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default formatTimestamp;
