var trainTime = {

    database: firebase.database(),

    i: 0,

    dropdowns: function() {
        for (var i=1; i<61; i++) {
            $("#freq").append("<option>" + i + "</option>");
            $("#fttm").append("<option>" + i + "</option");
        }

        for (var i=1; i<25; i++) {
            $("#ftth").append("<option>" + i + "</option>");
        }
    },

    trainInput: function(event, i) {
        event.preventDefault();

        var tnnm = $("#tnnm").val().trim().toLowerCase();
        var dest = $("#dest").val().trim();
        var ftth = $("#ftth").val().trim();
        var fttm = $("#fttm").val().trim();
        var fitt = ftth + ":" + fttm;
        var freq = $("#freq").val().trim();

        if (tnnm && dest && fitt && freq) {
            this.database.ref().child(tnnm).set({
                destination: dest,
                firstTrainTime: fitt,
                frequency: freq, 
            })
            this.i++;
            $("#tnnm").val('');
            $("#dest").val('');
            $("#fitt").val('');
            $("#freq").val('');
        }

        else {
            alert("Please fill all fields");
        }
    },

    trainSearch: function(event) {
        event.preventDefault();

        var srch = $("#srch").val().trim().toLowerCase();

        this.database.ref().once("value").then(function(snapshot){

            if (snapshot.val().hasOwnProperty(srch)) {
                var trainObj = snapshot.val()[srch];
                $("#info").html("Train: " + srch + "&#13;&#10;Destination: " + trainObj.destination + "&#13;&#10;First Train Time: " + trainObj.firstTrainTime + "&#13;&#10;Frequency: " + trainObj.frequency);
                var ftt = moment(trainObj.firstTrainTime, "H:mm");
                console.log(ftt);
                var now = moment();
                console.log(now);
                var diff = now.diff(ftt, "hours", true);
                console.log(diff);
            }
            
            else {
                alert("There is no record of this train");
            }
        })
    }
};

$(document).ready(function() {trainTime.dropdowns()});

$(document).on("click", "#submit", function(e) {trainTime.trainInput(e, trainTime.i)});

$(document).on("click", "#search", function(e) {trainTime.trainSearch(e)})