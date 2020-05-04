(function ($) {
    let form = $('#newEventForm');
    let newName = $('#eventName');
    let newLocation = $('#location');
    let newDate = $('#eventDate');
    let newStart = $('#startTime');
    let newEnd = $('#endTime');

    form.submit(function(event){
        event.preventDefault();
        let name = newName.val();
        let location = newLocation.val();
        let date = newDate.val();
        let start = newStart.val();
        let end = newEnd.val();
        //check Form first
        let newEvents = $('#eventsList');
        let requestConfig = {
            method: "POST",
            url: "/newEvent",
            contentType: "application/json",
            // data: JSON.stringify({
            //     name: name,
            //     location: location,
            //     date: date,
            //     start: start,
            //     end: end
            // })
            data: {
                name: name,
                location: location,
                date: Date.parse(date),
                start: start,
                end: end
            }
        };
        //console.log(typeof requestConfig[data]);
        console.log(requestConfig);
        $.ajax(requestConfig).then(function (responseMessage) {
            let newE = $(responseMessage);
            //bind events here if need be
            newEvents.append(newE);            
        });
    });



})(window.jQuery);