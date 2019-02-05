// $(document).ready(function () {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCr-tf9hOHK18lwSgj2yCXBooqMB61fhOk",
    authDomain: "train-schedule-d6d4e.firebaseapp.com",
    databaseURL: "https://train-schedule-d6d4e.firebaseio.com",
    projectId: "train-schedule-d6d4e",
    storageBucket: "train-schedule-d6d4e.appspot.com",
    messagingSenderId: "559927710103"
  };
  firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

//Shows user the current time
$("#current-time").append(moment().format('MMMM Do YYYY, h:mm:ss a'));

// 2. Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    console.log($("#train-time-input").val().trim());

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var trainTime = moment($("#train-time-input").val().trim(), "HH:mm").format("X");
    var frequency = $("#frequency-input").val().trim();
    console.log("clicked");

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        dest: destination,
        trainTime: trainTime,
        freq: frequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.dest);
  console.log(newTrain.trainTime);
  console.log(newTrain.freq);

  alert("New Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#train-time-input").val("");
  $("#frequency-input").val("");
  return false;
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.key);

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var tName = childSnapshot.val().name;
  var tDest = childSnapshot.val().dest;
  var tTime = childSnapshot.val().trainTime;
  var tfreq = childSnapshot.val().freq;

//   train Info
  console.log(tName);
  console.log(tDest);
  console.log(tTime);
  console.log(tfreq);

  // Calculate the minutes until arrival using hardcore math
  // To calculate the months worked
  var trainTime = moment().diff(moment.unix(tTime, "X"), "minutes") % tfreq;
  console.log(trainTime);

  // Calculate the total billed rate
  var timeAway = tfreq - trainTime;
  console.log(timeAway);

    // Prettify the train start
    var tTimePretty = moment().add(timeAway, "minutes").format("HH:mm");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(tName),
    $("<td>").text(tDest),
    $("<td>").text(tfreq),
    $("<td>").text(tTimePretty),
    $("<td>").text(timeAway)
  );

    newRow.attr("id", childSnapshot.key);

    var removeButton = $("<button>");
    removeButton.text("x");
    removeButton.attr("data-key", childSnapshot.key);
    removeButton.on("click", removeTrain)

    newRow.append(removeButton);

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);

});
// remove a train using x button
database.ref().on("child_removed", function(childSnapshot) {
    console.log(childSnapshot.key);

    $("#" + childSnapshot.key).remove();

});

function removeTrain(){
    var key = $(this).attr("data-key");

    database.ref().child(key).remove();
}