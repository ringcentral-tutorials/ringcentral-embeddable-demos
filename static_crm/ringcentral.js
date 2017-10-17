// Add the RingCentral Web Widget
(function() {
  var rcs = document.createElement("script");
  rcs.src = "https://ringcentral.github.io/ringcentral-widget-demo/adapter.js";
  var rcs0 = document.getElementsByTagName("script")[0];
  rcs0.parentNode.insertBefore(rcs, rcs0);
  if (window.RCAdapter) {
    window.RCAdapter.setMinimized(false);
  }
})();

// Inbound Screen Pop Based in Message Event
(function () {
  window.addEventListener('message', function(e) {
    const data = e.data;
    if (data) {
      switch (data.type) {
        case 'rc-call-ring-notify':
          var id = number2id(data.call.from, number2user);
          if (id) {
            var contact = id2user[id];
            window.title = contact.character.displayName;
            window.history.pushState("", contact.character.displayName, "?id="+id);
            loadSingleUser(id, id2user);
          }
          break;
        default:
          break;
      }
    }
  })
})();