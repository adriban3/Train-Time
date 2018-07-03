var trainTime = {

    database: firebase.database(),

    int: "",

    // newUser: function(e) {
    //     e.preventDefault();
    //     //need to create sign-in page separate from regular index page?  Pass email and password from this form into these functions.
    //     var email = $("#emla").val();
    //     var password = $("#pass").val();

    //     firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    //         // Handle Errors here.
    //         var errorCode = error.code;
    //         var errorMessage = error.message;
    //         // ...
    //         if (errorCode == 'auth/weak-password') {
    //             alert('The password is too weak.');
    //           } 
              
    //         else {
    //             alert(errorMessage);
    //           }

    //         console.log(error);
    //       });
    //     },

    // signIn: function(e) {
    //     e.preventDefault();
    //     var email = $("#emla2").val();
    //     var password = $("#pass2").val();

    //     firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     // ...
    //     if (errorCode === 'auth/wrong-password') {
    //         alert('Wrong password.');
    //       } 
          
    //     else {
    //         alert(errorMessage);
    //       }

    //     console.log(error);
    //     document.getElementById('quickstart-sign-in').disabled = false;
    //     });
    // },

    dropdowns: function() {
        for (var i=1; i<61; i++) {
            if (i<60) {
                $("#fttm").append("<option>" + i + "</option>");
                $("#ftmu").append("<option>" + i + "</option>");
            }
            $("#freq").append("<option>" + i + "</option>");
            $("#frqu").append("<option>" + i + "</option>");
        }

        for (var i=1; i<24; i++) {
            $("#ftth").append("<option>" + i + "</option>");
            $("#fthu").append("<option>" + i + "</option>");
        }

        this.database.ref().once("value").then(function(snapshot) {

            var trainNames = snapshot.val();

            for (var propName in trainNames) {
                $("#ttud").append("<option>" + propName + "</options");
            }   
        });

        ui.start('#firebaseui-auth-container', {
            signInOptions: [
              firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
            // Other config options...
          });
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
                    $("#ftth").val('');
                    $("#fttm").val('');
                    $("#freq").val('');
                }
            })
        }

        else {
            alert("Please fill all fields");
        }
    },

    trainSearch: function(event, tint) {
        event.preventDefault();
        clearInterval(tint);

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
                $("#srch").val('');
                tint = setInterval(function() {trainTime.dynamic(trainObj,srch)}, 1000*60)    
            }
            
            else {
                alert("There is no record of this train");
                $("#srch").val('');
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
        var ttud = $("#ttud").val().trim();
        var desu = $("#desu").val().trim();
        var fthu = $("#fthu").val().trim();
        var ftmu = $("#ftmu").val().trim();
        var frqu = $("#frqu").val().trim();
        var fittu = fthu + ":" + ftmu;
        if (ttud && desu && fthu && ftmu && frqu) {
            trainTime.database.ref().child(ttud).set({
                destination: desu,
                firstTrainTime: fittu,
                frequency: frqu, 
            })
            $("#ttud").val('');
            $("#desu").val('');
            $("#fthu").val('');
            $("#ftmu").val('');
            $("#frqu").val('');
        }
    },

    updatePopulate: function(key) {
        this.database.ref().once("value").then(function(snapshot) {
            $("#desu").val(snapshot.val()[key].destination);
            $("#fttu").val(snapshot.val()[key].firstTrainTime + ", " + snapshot.val()[key].frequency + " min");
        })
    },

    delete: function(e, tint) {
        e.preventDefault();
        var toDelete = $("#srch").val().trim();
        this.database.ref(toDelete).remove();
        $("#srch").val('');
        $("#info").html('');
        clearInterval(tint);
    }
};

$(document).ready(function() {trainTime.dropdowns()});

// $(document).on("click", "#userCreate", function(e) {trainTime.newUser(e)});

// $(document).on("click", "#signIn", function(e) {trainTime.signIn(e)})

$(document).on("click", "#submit", function(e) {trainTime.trainInput(e)});

$(document).on("click", "#search", function(e) {trainTime.trainSearch(e, trainTime.int)});

$(document).on("click", "#update", function(e) {trainTime.update(e)});

$(document).on("click", "#delete", function(e) {trainTime.delete(e, trainTime.int)});

$(document).on("change", "#ttud", function() {trainTime.updatePopulate($(this).val())})