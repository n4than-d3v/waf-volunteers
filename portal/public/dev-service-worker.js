self.addEventListener("push", function (event) {
  const options = {
    ...event.data.json(),
  };
  const title = options.title;
  delete options.title;
  event.waitUntil(self.registration.showNotification(title, options));
});
