// replace these values with those generated in your TokBox Account
var apiKey = "46830654";
var sessionId = "1_MX40NjgzMDY1NH5-MTU5NDIzMzgxODQxOX5ZbnExbGRJVVIyQjJJakxwVlNqY0oxbml-fg";
var token = "T1==cGFydG5lcl9pZD00NjgzMDY1NCZzaWc9YzJjODYxMmI0NzZlMDdmM2Y0ZjJhNmNlOTMzZTQ0MGZjZjllODczNTpzZXNzaW9uX2lkPTFfTVg0ME5qZ3pNRFkxTkg1LU1UVTVOREl6TXpneE9EUXhPWDVaYm5FeGJHUkpWVkl5UWpKSmFreHdWbE5xWTBveGJtbC1mZyZjcmVhdGVfdGltZT0xNTk0MjM0MDg5Jm5vbmNlPTAuNjg3NDg5MjkwNzE4OTA3NiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTk2ODI2MDg3JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

// (optional) add server code here
/* initializeSession(); */

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
   // alert(error.message);
  }
}

function initializeSession() {
  var session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream

  // Create a publisher
  var publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });
}
