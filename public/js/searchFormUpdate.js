$("#eventSearchParameter").change(() => {
    let paramVal = $("#eventSearchParameter").val()
    if (paramVal == "date") {
        $("#Submit").remove()
        $("#searchInput").remove()
        let searchInputDate = "<input type='date' id='searchInputDate' name='searchInputDate'>"
        let searchInputTime = "<input type='time' id='searchInputTime' name='searchInputTime'>"
        let submit = "<input type='submit' id='Submit' value='Submit'></input>"
        $("#searchForm").append(searchInputDate, searchInputTime, submit)
    } else {
        $("#Submit").remove()
        $("#searchInputDate").remove()
        $("#searchInputTime").remove()
        $("#searchInput").remove()
        
        let searchInput = "<input type='text' id='searchInput' name='searchInput'>"
        let submit = "<input type='submit' id='Submit' value='Submit'></input>"
        $("#searchForm").append(searchInput, submit)
    }
})

$("#searchForm").submit(() => {
    if($("#eventSearchParameter")) {
        //EVENT STUFF
        if ($("#eventSearchParameter").val() === 'date') {
            if ($("#searchInputDate").val() === '') {
                event.preventDefault()
                alert("You must enter a date")
                $('#searchInputDate').focus()
            }
            if ($("#searchInputTime").val() === '') {
                event.preventDefault()
                alert("You must enter a time")
                $('#searchInputTime').focus()
            }
            
        } else {
            if ($("#searchInput").val() === '') {
                event.preventDefault()
                alert("You must enter a search value")
                $('#searchInput').focus()
            }
        }
    } else {
        //FRIENDS STUFF
        if ($("#searchInput").val() === '') {
            event.preventDefault()
            alert("You must enter a search value")
            $('#searchForm').trigger('reset')
            $('#searchInput').focus()
        }
    }
    
})
