# YoutubeAPIApplication
Youtube web API application 

Developer: Saejong Jang

Description:
This is simple youtube API web application allowing user to search youtube channel. User has to log in with google account for autentication and service.User can type in channel name in a form to submit, then it will shows recent videos from the channel that user typed in.If user types in invalid or wrong channel name, it alerts error message.
 
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
