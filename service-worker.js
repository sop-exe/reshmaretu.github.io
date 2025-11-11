self.addEventListener("push", function (event) {
  const data = event.data ? event.data.text() : "Timer finished!";
  
  event.waitUntil(
    self.registration.showNotification("StudyBuddy", {
      body: data,
      icon: "images.png",
    })
  );
});