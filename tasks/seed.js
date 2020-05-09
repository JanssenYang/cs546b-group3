const users = require("../data/users");
const events = require("../data/events");
const connection = require('../config/mongoConnection');

async function main() {
	const db = await connection();
    try{
        //Adding users
        const user1 = await users.addUser("Patrick", "Hill", "phill", "cs546", "patrick.hill@stevens.edu");
        const user2 = await users.addUser("Nick", "Primamore", "nprimamo", "yankees99", "nprimamo@stevens.edu");
        const user3 = await users.addUser("Conner", "Zeigman", "czeigman", "ziggy22", "czeigman@stevens.edu");
        const user4 = await users.addUser("Liam", "King", "lking", "kings42", "lking2@stevens.edu");
        const user5 = await users.addUser("Sen", "Yang", "syang", "yang24", "syang41@stevens.edu");

        //Setting up friends
        //Not all users are friends, so some cannot see each others profiles (for testing purposes)
        const friends1 = await users.addFriend("phill", "nprimamo");
        const friends2 = await users.addFriend("phill", "czeigman");
        const friends3 = await users.addFriend("nprimamo", "czeigman");
        const friends4 = await users.addFriend("nprimamo", "lking");
        const friends5 = await users.addFriend("czeigman", "syang");
        const friends6 = await users.addFriend("lking", "czeigman");
        const friends7 = await users.addFriend("syang", "phill");

        //Creating Prof. Hill's events
        const patrickEvent1 = await events.addEvent("CS 546 A", "friends", new Date(2020, 4, 14), "18:30", "21:00", "GS 216", user1._id.toString());
        const patrickEvent2 = await events.addEvent("CS 546 B", "friends", new Date(2020, 4, 15), "18:30", "21:00", "GS 216", user1._id.toString());
        const patrickEvent3 = await events.addEvent("Record Lecture Videos", "private", new Date(2020, 4, 16), "13:00", "15:00", "Home", user1._id.toString());
        const patrickEvent4 = await events.addEvent("Job Meeting", "private", new Date(2020, 4, 18), "09:00", "11:00", "Work", user1._id.toString());

        //Creating Nick's events
        const nickEvent1 = await events.addEvent("Yankees Game", "friends", new Date(2020, 4, 14), "19:00", "22:00", "Yankee Stadium", user2._id.toString());
        const nickEvent2 = await events.addEvent("Project Meeting", "friends", new Date(2020, 4, 18), "13:00", "14:00", "Stevens Library", user2._id.toString());
        const nickEvent3 = await users.addEvent("nprimamo", patrickEvent2._id); //attending Prof. Hill's class event
        const nickComment = await events.addComment(patrickEvent2._id, "nprimamo", "I might be a little late today.", new Date(2020, 4, 15), "17:00");

        //Creating Conner's events
        const connerEvent1 = await events.addEvent("Club Meeting", "friends", new Date(2020, 4, 13), "21:00", "22:00", "K 306", user3._id.toString());
        const connerEvent2 = await users.addEvent("czeigman", nickEvent2._id); //attending Nick's project meeting event
        const connerEvent3 = await users.addEvent("czeigman", patrickEvent2._id); //attending Prof. Hill's class event

        //Creating Liam's events
        const liamEvent1 = await events.addEvent("Concert", "friends", new Date(2020, 4, 14), "19:00", "23:00", "NYC", user4._id.toString());
        const liamEvent2 = await users.addEvent("lking", nickEvent2._id); //attending Nick's project meeting event
        const liamEvent3 = await users.addEvent("lking", patrickEvent2._id); //attending Prof. Hill's class event
        const liamComment = await events.addComment(patrickEvent2._id, "lking", "Same here ^", new Date(2020, 4, 15), "17:14");

        //Creating Sen's events
        const senEvent1 = await events.addEvent("Video Conference", "friends", new Date(2020, 4, 15), "14:00", "15:00", "Home", user5._id.toString());
        const senEvent2 = await users.addEvent("syang", nickEvent2._id); //attending Nick's project meeting event
        const senEvent3 = await users.addEvent("syang", patrickEvent2._id); //attending Prof. Hill's class event

        const patrickComment = await events.addComment(patrickEvent2._id, "phill", "No problem guys.", new Date(2020, 4, 15), "17:30");

        //Adding events and comments to the Public Events Page
        //Dates are date objects (with months being 0-indexed), and times are in 24-hour format
        const publicEvent1 = await events.addEvent("Stevens Varsity Baseball Game", "public", new Date(2020, 4, 21), "13:00", "16:00", "DeBaun Field", user2._id.toString());
        const comment1 = await events.addComment(publicEvent1._id, "nprimamo", "Who's the opposing team?", new Date(2020, 4, 9), "10:00");
        const publicEvent2 = await events.addEvent("CS Club Meeting", "public", new Date(2020, 4, 22), "21:00", "22:00", "GS 216", user1._id.toString());
        const publicEvent3 = await events.addEvent("Tech Fest", "public", new Date(2020, 4, 23), "19:00", "22:00", "Palmer Lawn", user3._id.toString());
        const comment2 = await events.addComment(publicEvent3._id, "nprimamo", "Who's performing?", new Date(2020, 4, 8), "16:48");
        const comment3 = await events.addComment(publicEvent3._id, "lking", "I don't think it got announced yet lol", new Date(2020, 4, 8), "17:00");

    }catch(e){
        console.log(e);
	}
	await db.serverConfig.close();
}

main();