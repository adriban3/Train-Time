var trainTime = {

    database: firebase.database(),

    i: 0,

    trainInput: function(event, i) {
        event.preventDefault();

        var tntm = $("#tntm").val().trim();
        var dest = $("#dest").val().trim();
        var fitt = $("#fitt").val().trim();
        var freq = $("#freq").val().trim();

        this.database.ref().child("train" + i).set({
            trainTime: tntm,
            destination: dest,
            firstTrainTime: fitt,
            frequency: freq, 
        })
        this.i++;
    },

    trainSearch: function(event) {
        event.preventDefault();

        var criteria = $("#dpdn").val().trim();
        var value = $("#srch").val().trim();

        this.database.ref().once("value").then(function(snapshot){
            console.log(snapshot.val());
        })


    }
}

$(document).on("click", "#submit", function(e) {trainTime.trainInput(e, trainTime.i)});

$(document).on("click", "#search", function(e) {trainTime.trainSearch(e)})
