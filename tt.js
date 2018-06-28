var trainTime = {

    database: firebase.database(),

    i: 0,

    trainInput: function(event, i) {
        event.preventDefault();

        var tnnm = $("#tnnm").val().trim().toLowerCase();
        var dest = $("#dest").val().trim();
        var fitt = $("#fitt").val().trim();
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
                $("#info").html(trainObj.destination + '<br>' + trainObj.firstTrainTime + '<br>' + trainObj.frequency);
            }
            
            else {
                alert("There is no record of this train");
            }
        })


    }
}

$(document).on("click", "#submit", function(e) {trainTime.trainInput(e, trainTime.i)});

$(document).on("click", "#search", function(e) {trainTime.trainSearch(e)})
