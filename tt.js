var trainTime = {

    database: firebase.database(),

    int: "",

    newUser: function(e) {
        e.preventDefault();
        //need to create sign-in page separate from regular index page?  Pass email and password from this form into these functions.
        var email = $("#emla").val();
        var password = $("#pass").val();

        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
              } 
              
            else {
                alert(errorMessage);
              }

            console.log(error);
          });
        },

    signIn: function(e) {
        e.preventDefault();
        var email = $("#emla2").val();
        var password = $("#pass2").val();

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } 
          
        else {
            alert(errorMessage);
          }

        console.log(error);
        document.getElementById('quickstart-sign-in').disabled = false;
        });
    },

    dropdowns: function() {
        for (var i=1; i<61; i++) {
            if (i<60) {
                $("#fttm").append("<option>" + i + "</option");
            }
            $("#freq").append("<option>" + i + "</option>");
        }

        for (var i=1; i<24; i++) {
            $("#ftth").append("<option>" + i + "</option>");
        }
    },

    trainInput: function(event) {
        event.preventDefault();

        var tnnm = $("#tnnm").val().trim().toLowerCase();
        var dest = $("#dest").val().trim();
        var ftth = $("#ftth").val().trim();
        var fttm = $("#fttm").val().trim();
        var fitt = ftth + ":" + fttm;
        var freq = $("#freq").val().trim();

        if (tnnm && dest && fitt && freq) {  
                
            this.database.ref().once("value").then(function(snapshot) {

                if (snapshot.val().hasOwnProperty(tnnm)) {
                    alert("This train already exists, please view entry and update below");
                }

                else {

                    trainTime.database.ref().child(tnnm).set({
                        destination: dest,
                        firstTrainTime: fitt,
                        frequency: freq, 
                    })
                    $("#tnnm").val('');
                    $("#dest").val('');
                    $("#fitt").val('');
                    $("#freq").val('');
                }
            })
        }

        else {
            alert("Please fill all fields");
        }
    },

    trainSearch: function(event) {
        event.preventDefault();
        clearInterval(trainTime.int);

        var srch = $("#srch").val().trim().toLowerCase();

        this.database.ref().once("value").then(function(snapshot){

            if (snapshot.val().hasOwnProperty(srch)) {
                var trainObj = snapshot.val()[srch];
                var ftt = moment(trainObj.firstTrainTime, "H:mm");
                var diff = moment().diff(ftt, "minutes", true);
                var numTrains = Math.ceil(diff/parseInt(trainObj.frequency));
                var trainhrs = numTrains*trainObj.frequency;
                var nextTrain = ftt.add(trainhrs, 'm');
                var fn = nextTrain.fromNow();
                $("#info").html("Train: " + srch + "&#13;&#10;Destination: " + trainObj.destination + "&#13;&#10;First Train Time: " + trainObj.firstTrainTime + "&#13;&#10;Frequency: " + trainObj.frequency + "&#13;&#10;Next Train arrives " + fn);
                trainTime.int = setInterval(function() {trainTime.dynamic(trainObj,srch)}, 1000*60)    
            }
            
            else {
                alert("There is no record of this train");
            }
        })
    },

    dynamic: function(obj,srch) {
        console.log(obj);
        var ftt = moment(obj.firstTrainTime, "H:mm");
        var diff = moment().diff(ftt, "minutes", true);
        var numTrains = Math.ceil(diff/parseInt(obj.frequency));
        var trainhrs = numTrains*obj.frequency;
        var nextTrain = ftt.add(trainhrs, 'm');
        var fn = nextTrain.fromNow();
        $("#info").html("Train: " + srch + "&#13;&#10;Destination: " + obj.destination + "&#13;&#10;First Train Time: " + obj.firstTrainTime + "&#13;&#10;Frequency: " + obj.frequency + "&#13;&#10;Next Train arrives " + fn);
    }, 

    update: function(e) {
        e.preventDefault();
    },

    delete: function(e) {
        e.preventDefault();
        var toDelete = $("#srch").val().trim();
        this.database.ref(toDelete).remove();
    }
};

$(document).on("click", "#userCreate", function(e) {trainTime.newUser(e)});

$(document).on("click", "#signIn", function(e) {trainTime.signIn(e)})

$(document).ready(function() {trainTime.dropdowns()});

$(document).on("click", "#submit", function(e) {trainTime.trainInput(e)});

$(document).on("click", "#search", function(e) {trainTime.trainSearch(e, trainTime.int)});

$(document).on("click", "#update", function(e) {trainTime.update(e)});

$(document).on("click", "#delete", function(e) {trainTime.delete(e)});