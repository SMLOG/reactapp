export function notifyMe(title, msg) {
  // Let's check if the user is okay to get some notification
  console.log(title, msg);
  if (Notification.permission !== "granted") Notification.requestPermission();
  if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(title, { body: msg });
    notification.onclick = notification.close.bind(notification);
    setTimeout(notification.close.bind(notification), 8000);
  }
  // At last, if the user already denied any notification, and you
  // want to be respectful there is no need to bother him any more.
}
