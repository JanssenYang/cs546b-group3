$("#eventSearchParameter").change(() => {
    let paramVal = $("#eventSearchParameter").val()
    if (paramVal == "date") {
        $("#Submit").remove()
        $("#searchInput").remove()
        let searchInput = "<input type='date' id='searchInput' name='searchInput'>"
        let submit = "<input type='submit' id='Submit' value='Submit'></input>"
        $("#searchForm").append(searchInput, submit)
    } else {
        $("#Submit").remove()
        $("#searchInput").remove()
        let searchInput = "<input type='text' id='searchInput' name='searchInput'>"
        let submit = "<input type='submit' id='Submit' value='Submit'></input>"
        $("#searchForm").append(searchInput, submit)
    }
})

$("#searchForm").submit(() => {
    if ($("#searchInput").val() === '') {
        event.preventDefault()
        alert("You must enter a search value")
        $('#searchForm').trigger('reset')
        $('#searchInput').focus()
    }
})
