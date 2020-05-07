# Schedule Sharing Web Application

CS-546-B Group 3:
Nick Primamore, Conner Zeigman, Liam King, Sen Yang

Github Link: https://github.com/JanssenYang/cs546b-group3

A scheduling application with a social media twist. Users of our app can add events to their schedules, as well as add friends. When friends with someone, the user will be able to view that friend’s public events, as well as comment on each other’s events. If a user would like to attend a friend’s event, there will be a button for the user to press that will add the event to their personal schedule. When an event is clicked on, it will show all details about the event, including comments. The public events page is a community page for our app, where any user can view/add events, comment on events, or even add these public events to their personal schedule. Comments will be visible to all users attending the same event.

“npm seed” can be run to populate the database. We’ve added multiple users and friends, personal events for each user, as well as public events on the public events page. There are also comments on some of the events.

“npm start” will run our application and it will bring you to the login page. Our seed script created a user account for you: the username is “phill” and the password is “cs546”. You can also register a new user by clicking the link on the login page.

After logging in, the app will take you to your main profile page which displays your events and friends. A friend’s name can be clicked on to view their events. Each event can be clicked on to display a page showing all of the event details and comments. There will be an option to add this event to your schedule if you want to attend. If the event clicked on is one of your personal events, you will also be able to modify and delete the event on this page. 

Also on the profile page, there are “Add Event” and “Search” buttons. “Add Event” will bring up a form for the user to fill out all event details, and it will add it to their schedule. You can make it a private event for only you to see, or public for your friends to see when they view your profile. “Search” will bring you to a page where you can search upon events given certain criteria (name, location, etc.), and you can also search and add friends on this page.

Finally, there will be a link on all profile pages that will bring you to the system-wide Public Events Page. There will be a list of all public events that any user can view and comment on. Like the profile page, there will be an “Add Event” form for any user to add an event to the Public Events Page. This page is completely separate from a user's personal schedule, but users can add these events to their calendar if they would like to attend (through a button when the event is clicked on).