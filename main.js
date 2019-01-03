 /*
 Developer: Saejong Jang

 Description:
 This is simple youtube API web application allowing user to search youtube channel.
 User has to log in with google account for autentication and service.
 User can type in channel name in a form to submit
 , then it will shows recent videos from the channel that user typed in.
 If user types in invalid or wrong channel name, it alerts error message.

 Environment: 
 Editor => VSCode
 Server => Apache(localhost running on Xampp) 
 Language => HTML, CSS, JavaScript

 Sources used:
 YouTube DataAPI developers & StackOverflow => 
 Guding for google OAuth ClientID for valid API request
 and referceing QuickStart, Channels, PlaylistItems JavaScript examples for API methods
 
 List the HTTP requests and responses:
 1. Make HTTP GET request: getChannel function => if request success, then get callback as a response over webconnection
 2. .then(function(response) => handles response from the server and grabing channel details
 3. RequestVideoPlaylist(playlistId, channel) => passing parameters from the http response(playlistId, channel) 
 4. Make PlaylistItem API request on RequestVideoPlaylist function => if request success, then get callback as a response over webconnection
 5. If request success and response.result.item is not null => display youtube contents with using iframe.

 */

// Client ID and API key from the Developer Console
const CLIENT_ID = '38789857756-eo7ipoo1uuvsnn34h3i0tfa26nrk2mv2.apps.googleusercontent.com';
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
];
// Authorization scopes required by the API. 
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

const defaultChannel = 'nike';

///////////////////////////////////////////////////////////////////////////
//                           Handling OAuth                              // 
///////////////////////////////////////////////////////////////////////////

//On load, called to load the auth2 library and API client library.
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

//Initialize API client library and set up sign in listeners
function initClient() {
  gapi.client.init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES
    })
    .then(function () {
      // Listen for sign in state changes
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      // Handle initial sign in state
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    });
}

//Called when the signed in status changes, to update the UI appropriately. 
//After a sign-in, the API is called.
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    content.style.display = 'block';
    videoContainer.style.display = 'block';
    getChannel(defaultChannel);
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    content.style.display = 'none';
    videoContainer.style.display = 'none';
  }
}

// Sign in the user upon button click.
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

// Sign out the user upon button click.
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
  //refresh the page after signing out
  window.location.reload(true); 
}

///////////////////////////////////////////////////////////////////////////
//                           Fetching data                               // 
///////////////////////////////////////////////////////////////////////////

function getChannel(channel) {
//make GET request and get channel from API
  gapi.client.youtube.channels.list({
      //object
      part: 'snippet,contentDetails,statistics',
      forUsername: channel
    })
    //if request success, then get response
    .then(function(response) {
      console.log(response);
      //channel details
      const channel = response.result.items[0];
      const playlistId = channel.contentDetails.relatedPlaylists.uploads;
      //make request for the video data details
      requestVideoPlaylist(playlistId, channel);
    })
    .catch(function(err){alert('cannot find the channel')});
}

//submit and change channel
channelForm.addEventListener('submit', function(err) {
    err.preventDefault();
    const channel = channelInput.value;
    getChannel(channel);
});

function requestVideoPlaylist(playlistId, channel) {
  const requestOptions = {
    playlistId: playlistId,
    part: 'snippet',
    maxResults: 8
  };

  const request = gapi.client.youtube.playlistItems.list(requestOptions);
  request.execute(function(response) {
    console.log(response);
    const playListItems = response.result.items;
    const firstItem = response.result.items[0];
    console.log(firstItem);

    if (playListItems) {
        let playListInnerHTML ="";
      if(firstItem){
          const videoId = firstItem.snippet.resourceId.videoId;
          playListInnerHTML += `<br>
          <p align="center"><iframe width="100%" height="600" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          </p><br>`;
      }

      playListInnerHTML += `<br><h4 class="center-align">Recent Videos from ${channel.snippet.title}</h4>`;
      // Loop through videos and append output
      playListItems.forEach(function(item) {
        const videoId = item.snippet.resourceId.videoId;

        playListInnerHTML += `
          <div class="col s3">
          <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          </div>`;
      });
      //print out appended output
      videoContainer.innerHTML = playListInnerHTML;
    } else {
      videoContainer.innerHTML = 'No Uploaded Videos';
    }
  });
}