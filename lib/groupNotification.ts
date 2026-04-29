export function groupNotifications(notifications: any[]) {
  const groups = {
    today: [],
    yesterday: [],
    earlier: [],
  };

  const now = new Date();

  notifications.forEach((n) => {
    const date = new Date(n.createdAt);
    const diff = now.getTime() - date.getTime();

    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < oneDay) groups.today.push(n);
    else if (diff < 2 * oneDay) groups.yesterday.push(n);
    else groups.earlier.push(n);
  });

  return groups;
}