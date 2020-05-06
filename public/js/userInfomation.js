const article_friend = document.getElementById("user_friendList");
//data in string
const user_friend = document.getElementById("user_friend");
const user_event = document.getElementById("user_event");

// console.log(typeof user_friend.innerHTML);
console.log(user_friend.innerHTML);
let friend = JSON.parse(user_friend.innerHTML);
let event = JSON.parse(user_event.innerHTML);

if(article_friend){
    for( let i=0; i<friend.length; i++ ){
        let a = document.createElement('a');
        a.innerHTML = friend[i].userName;
        a.href = "http://localhost:3000/users/"+friend[i].userName;
        article_friend.appendChild(a);
    }
}

const table = document.getElementById("schedule");
let month=0, year=0;
setTimeout("transEventDateToArray()",10);
let transEventDateToArray=()=>{
    for(let i=0; i<event.length; i++){
        let str = event[i].eventdate;
        event[i].eventdate = transFromTimeToArray(str);
        console.log(event[i]);
    }
}

let transFromTimeToArray=(str)=>{
    console.log(str);
    let arr = str.split("T");
    str = arr[0].split("-");
    for(let j=0; j<str.length; j++){
        str[j] = parseInt(str[j]);
    }
    return str;
}
//update month and year every 2 second.
setInterval( "updateTime();", 20 );
// setTimeout( "updateTime();",200 );//for test
let cleanTable=()=>{
    let rowLength = table.rows.length;
    for( let i=1; i<rowLength; i++ ){
        table.deleteRow(1);
    }
    // console.log(table);
}
let updateTime=()=>{
    // console.log(month)
    month = document.f.month.value;
    year = document.f.year.value;
    let error=null;
    if( isNaN(month) || month<1 || month>12 ){
        error = "Error: month is not valid.";
    }
    if( isNaN(year) || year<1970 ){
        error= "Error: year is not valid.";
        return;
    }
    cleanTable();
    let now = new Date(""+month+" 01,"+year);
    // console.log(now);
    // console.log("year="+year+"month="+month);
    let event_thisMonth=[];
    for( let i=0; i<event.length; i++ ){
        let date = event[i].eventdate;
        if( date[0] == year){
            // console.log(date[0]+" "+date[1]);
            if( date[1] == month ){
                event_thisMonth.push(event[i]);
                // console.log(date[1]+" "+date[2]);
            }
        }
    }
    // console.log(now.getDay());
    //month 1st is the w-th day of the week
    let w = now.getDay();
    // this month has m days 
    let mDay=getMonthLength(now);
    // console.log(mDay);
    let day = 0-w+1, countDay=0;
    while( day<=mDay ){
        let row = document.createElement('tr');
        for( countDay=0; countDay<7; countDay++ ){
            let data = document.createElement('td');
            if( day<=0 || day>mDay ){
            
            }else{
                data.innerHTML = day;
                for(let i=0; i<event_thisMonth.length; i++){
                    let edate = event_thisMonth[i].eventdate[2];
                    if( day == edate ){
                        let alink = document.createElement('a');
                        alink.innerHTML = event_thisMonth[i].eventName;
                        alink.href = "http://localhost:3000/events/"+event_thisMonth[i].eventId;
                        let br = document.createElement('br');
                        data.appendChild(br);
                        data.appendChild(alink);
                    }
                }
            }
            row.appendChild(data);
            day++;
        }
        table.appendChild(row);
    }
}

let getMonthLength=(date)=>{
    let d = new Date(date);
    d.setMonth( d.getMonth()+1 );
    d.setDate('1');
    d.setDate( d.getDate()-1 );
    return d.getDate();
}