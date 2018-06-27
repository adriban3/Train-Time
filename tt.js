var trainTime = {

    database: firebase.database(),

    trainInput: function(event) {
        event.preventDefault();

        var tntm = $("#tntm").val().trim();
        var dest = $("#dest").val().trim();
        var fitt = $("#fitt").val().trim();
        var freq = $("#freq").val().trim();

        this.database.ref().push({
            trainTime: tntm,
            destination: dest,
            firstTrainTime: fitt,
            frequency: freq, 
        })
    }
}

$(document).on("click", "#submit", function(e) {trainTime.trainInput(e)});
