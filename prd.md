# WeightLoss Tracker


# Design structure
- black and dark green background 
- Glassmorphism UI, keep most panels and navbars transparent

This will be a nextjs app, with supabase as database and auth.
I have already created the supabase project and tables. For database please refer to supabase.ts file.


# Landing Page
- We already have a landing page, with signup and login option, use the same. Don't create a new login page.


# Profile
- Name, Profile Picture, Email, email verification tick mark (email verification will be require smtp server, use those values from env)
- Date of birth, height (in cm), weight (in kgs)

# Signed In User
There will be two option on the navbar
1. Groups
2. Profile

A option to logout in the uppper right corner


# Groups Page

Sec 1: An option to log new entry of weight with date ( by calender input)

Sec 2: there will be two option
1. create group
2. Join group by groupId

Sec 3: Show the existing groups in form of cards. 
    - Use user's picture icon to show group owner
    - Also show the count of total users in the group

# Group Properties
- group ID (unique for every group)
- group name
- group description
- group creator
- group members

# Create Group
- A popup will come that will ask for name and description, and creates group
- Creator can then share invite link to others to join the group, or can share the group ID directly

# Group Page
When user clicks on any group, they are navigated to group page. 
- Every group page will have paginated list of memebers on the right side (10 members per page max)
- In middle it'll have one weight graph of weight of all members in the group
- At the left of the group page will have details of group, like discription, name, and option to exit group
- Group owner will have option to remove members, and delete the group if no members exist.

In the mobile view, the component of members of group will be below graph. And the content of details of group will be top of graph



# Profile 
Show profile in any beautiful manner, just add a option to update the profile as well.



