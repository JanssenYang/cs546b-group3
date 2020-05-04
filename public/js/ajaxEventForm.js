(function ($) {
    let InpForm = $('#newEventForm');
    let newName = $('#eventName');
    let newLocation = $('#location');
    let newDate = $('#eventDate');
    let newStart = $('#startTime');
    let newEnd = $('#endTime');

    InpForm.submit(function(event){        
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
            url: "/events/newEvent",
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                location: location,
                date: date,
                start: start,
                end: end
            })
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log("In ajax command");
            let newE = $(responseMessage);
            //bind events here if need be
            newEvents.append(newE);            
        });
    });
})(window.jQuery);