const article_friend = document.getElementById("user_friendList");
//data in string
const user_friend = document.getElementById("user_friend");
const user_event = document.getElementById("user_event");

// console.log(typeof user_friend.innerHTML);
// console.log(user_friend.innerHTML);
let friend = JSON.parse(user_friend.innerHTML);
let event = JSON.parse(user_event.innerHTML);
// console.log(event);

if(article_friend){
    for( let i=0; i<friend.length; i++ ){
        let a = document.createElement('a');
        a.innerHTML = friend[i].userName;
        a.href = "http://localhost:3000/users/"+friend[i].userName;
        article_friend.appendChild(a);
    }
}

const table = document.getElementById("schedule");
let month=0, year=0,day=0;
setTimeout("transEventDateToArray()",10);
let transEventDateToArray=()=>{
    for(let i=0; i<event.length; i++){
        let str = event[i].eventdate;
        event[i].eventdate = transFromTimeToArray(str);
        // console.log(event[i]);
    }
}

let transFromTimeToArray=(str)=>{
    // console.log(str);
    let arr = str.split("T");
    str = arr[0].split("-");
    for(let j=0; j<str.length; j++){
        str[j] = parseInt(str[j]);
    }
    return str;
}
setTimeout( "updateTimeAsTheNewestOne()", 0 );
let updateTimeAsTheNewestOne=()=>{
    // let cur = document.f.select_date.value;
    let curDate = new Date();
    let y = curDate.getFullYear();
    let m = curDate.getMonth()+1;
    let d = curDate.getDate();
    if( m<10 ) m = '0'+m;
    if( d<10 ) d = '0'+d;
    // console.log(y+" "+m+" "+d);
    document.f.select_date.value = y+'-'+m+'-'+d;
}
//update month and year every 2 second.
setTimeout("updateTime()", 20);
setInterval( "updateTime();", 2000 );
// setTimeout( "updateTime();",200 );//for test
let cleanTable=()=>{
    let rowLength = table.rows.length;
    for( let i=1; i<rowLength; i++ ){
        table.deleteRow(1);
    }
}
const view = document.getElementsByName('view');
let updateTime=()=>{
    // month = document.f.month.value;
    // year = document.f.year.value;
    let date = document.f.select_date.value;
    // console.log(typeof date);
    // console.log("aaa"+date+"aaa");
    if(!date) return;
    let arr = date.split('-');
    month = parseInt(arr[1]);
    year =  parseInt(arr[0]);
    day =  parseInt(arr[2]);
    // console.log(month+" "+day+" "+year);
    let error=null;
    if( isNaN(month) || month<1 || month>12 ){
        error = "Error: month is not valid.";
    }
    if( isNaN(year) || year<1970 ){
        error= "Error: year is not valid.";
    }
    if( isNaN(day) || day<1 || day >31  ){
        error= "Error: day is not valid.";
    }
    if( error ){console.log(error); return;}
    cleanTable();
    //select monthly or weekly
    let mark=0;
    for( let i=0; i<view.length; i++ ){
        if(view[i].checked){
            mark = view[i].value;
            break;
        }
    }
    if( !mark ) return;
    else if(mark ==1) updateTimeMonthly();
    else if( mark == 2 ) updateTimeWeekly();
}
let updateTimeWeekly=()=>{
    let selectDate = new Date(""+month+" "+day+","+year);
    // console.log(selectDate);
    let w = selectDate.getDay();
    // console.log(w);
    // let startDate = new Date(""+month+" "+(day-w)+","+year);
    let startDate = new Date(selectDate);
    startDate.setDate(startDate.getDate()-w);
    // let endDate = new Date(""+month+" "+(day+6-w)+","+year);
    let endDate = new Date(selectDate);
    endDate.setDate( endDate.getDate()+(6-w) );
    let titleRow = document.createElement('tr');
    let contentRow=document.createElement('tr');
    let temp = new Date(startDate);
    for(let i=0; i<7; i++){
        let td = document.createElement('td');
        td.innerHTML = (temp.getMonth()+1)+"/"+temp.getDate();
        td.className = 'td_title';
        titleRow.appendChild(td);
        let td2 = document.createElement('td');
        // td2.innerHTML = temp.getDate();
        let y = parseInt(temp.getFullYear()), m =parseInt( temp.getMonth())+1, d=parseInt(temp.getDate());
        // console.log( y+" "+m+" "+d );
        for( let j=0; j<event.length; j++ ){
            let date = event[j].eventdate;
            // console.log(date);
            if( date[0] == y ){
                if( date[1] == m ){
                    if( date[2] == d ){
                        let text = document.createElement('article');
                        text.className = "tableData";
                        //eventName
                        let alink = document.createElement('a');
                        alink.innerHTML = event[j].eventName;
                        alink.href = "http://localhost:3000/events/"+event[j].eventId;
                        let br = document.createElement('br');
                        text.appendChild(alink);
                        text.appendChild(br);
                        //event location
                        let p = document.createElement('p');
                        p.hidden = true;
                        p.innerHTML = "location:"+event[j].eventLocation;
                        text.appendChild(p);
                        // set visibility
                        let p1 = document.createElement('a');
                        p1.hidden = true;
                        p1.innerHTML = ""+event[j].vis;
                        p1.href = "http://localhost:3000/home/"+event[j].eventId;
                        text.appendChild(p1);

                        // let vis = document.createElement('button');
                        // // vis.setAttribute("summit");
                        // vis.innerHTML = "change";
                        // vis.name = event[j].eventId;
                        // vis.className = "visibility";
                        // text.appendChild(vis);

                        td2.appendChild(text);
                    }
                }
            }
        }
        contentRow.appendChild(td2);
        temp.setDate(temp.getDate()+1);
    }
    table.appendChild(titleRow);
    table.appendChild(contentRow);
}
let updateTimeMonthly=()=>{
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
                let num = document.createElement('p');
                num.innerHTML = day;
                num.className = "dateInTable";
                data.appendChild(num);
                for(let i=0; i<event_thisMonth.length; i++){
                    let edate = event_thisMonth[i].eventdate[2];
                    if( day == edate ){
                        let text = document.createElement('article');
                        text.className = "tableData";
                        let alink = document.createElement('a');
                        alink.innerHTML = event_thisMonth[i].eventName;
                        alink.href = "http://localhost:3000/events/"+event_thisMonth[i].eventId; //cant access unless open in new tab
                        let br = document.createElement('br');
                        text.appendChild(alink);
                        text.appendChild(br);
                        
                        //event location
                        let p = document.createElement('p');
                        p.innerHTML = "location:"+event_thisMonth[i].eventLocation;
                        p.hidden = true;
                        text.appendChild(p);
                        // set visibility
                        let p1 = document.createElement('a');
                        p1.hidden = true;
                        p1.innerHTML = ""+event_thisMonth[i].vis;
                        p1.href = "http://localhost:3000/home/"+event_thisMonth[i].eventId;
                        text.appendChild(p1);

                        data.appendChild(text);
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