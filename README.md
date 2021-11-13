# Project Proposal

## Project Description

As a team of creatives, we set out to build a platform that would find a home in our own daily workflows. We identified a time-consuming task common to us all: finding royalty-free stock images. Services such as Adobe Stock Images provide a paid solution that the majority of amateurs can’t afford, and services such as Unsplash and Pexel aim to fill the void by providing royalty-free stock images at no cost but fall short in their limited selection. Oftentimes, this forces creatives to waste valuable time switching from site to site looking for their desired image, leaving behind a wake of disorganization. Our group looks to make a once-tedious process simple by aggregating images from popular no-cost royalty free stock image sites and providing a hub for users to save or download image collections.

## Technical Description

### Architecture Diagram

![Architecture Diagram](./imgs/architecture_diagram.png)

### User Stories

|Priority|User|Description|Technical Implementation|
|---|---|---|---|
|P0|As a user|I want to conveniently search free stock images to use for my personal project from multiple popular free stock image websites at once.|When a user searches for a certain image, the input keyword will be passed in as a **query** to multiple **APIs** for different popular websites.|
|P1|As a user|I want to download the image I like from the aggregated search result across different websites.|When a user clicks on the image, the user will be directed to an external website that will let them download the image.|
|P2|As a user|I want to have an account to keep my favorite photos in my personal “favorites” list.|When a user tries to save or like the photo they want to save in their personal list of favorite photos, they will be directed to enter their ID and password to login. They will have different login options such as Google, FB, or etc which will be implemented via **Azure** or **ReactJs**.|
|P3|As a user|I want to save photos I searched for among different websites to my own collection for future reference.|When a user saves a photo he/she likes, it will be saved in **MongoDB** as an external storage to get back to it later and easily download it again as well.|

### Endpoints

#### Search for photos
- **Use Case:** User queries photos based on search/query parameters.
- **Type:** GET
- **Return:** JSON
- Returns list of photos in JSON format based on search parameters including link.

#### Favorite photo(s)
- **Use Case:** User favorites photo(s) they like to their account.
- **Type:** POST
- **Return:** Plain Text
- Returns text on whether or not the photo(s) were successfully saved to the user's account.

#### Retrieve favorited photo(s)
- **Use Case:** User retrieves photo(s) they have favorited to the their account.
- **Type:** POST
- **Return:** JSON
- Returns list of users' favorited photos in JSON format.
