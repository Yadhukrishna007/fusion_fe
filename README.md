
# FUSION

A Real-time Messaging platform. Leveraged Socket.IO and WebRTC to enable face-to-face video calls and instant messaging.


![Logo](https://res.cloudinary.com/duxrswftp/image/upload/v1717689270/chatbot/Blue_and_Green_Modern_Soccer_Match_Banner_1_ww2ij9.png)
![App Screenshot](https://res.cloudinary.com/duxrswftp/image/upload/v1717739965/chatbot/63a78055-7261-4524-bca3-49f221065dab.png)



## Features

* Real-time Messaging: Leveraged Socket.IO and WebRTC to enable face-to-face video calls and instant messaging.
* File Sharing: Enabled users to share various file types including images, videos, documents (PDF/DOC), and compressed files (RAR/ZIP), enhancing collaboration.
* Group Chats: Facilitated group discussions and idea sharing with support for multiple participants in real-time.
* Typing Indicator: Enhanced user experience by displaying typing indicators, allowing users to see when others are composing messages.
* Emoji Support: Enriched communication by providing a diverse range of emojis for users to express themselves effectively.
* Advanced Search: Implemented an advanced search functionality for users to easily find contacts within the platform.
* State Management: Utilized Redux Toolkit along with Redux Persist for efficient state management, ensuring seamless user interactions.
* Multilanguage Support: Catered to diverse user bases by offering multilanguage support within the platform.
* Dark/Light Mode: Incorporated a dark/light mode feature for customizable user experiences.
* User Profile Management: Enabled users to edit their profiles, including group descriptions and profile pictures, enhancing personalization.
* Media Storage: Utilized Cloudinary for efficient storage and management of media files within the platform.
* Validation: Implemented robust validation mechanisms using React Hook Form to ensure data integrity and security.
* Real-time Online Status: Provided users with real-time status updates, indicating the online presence of contacts for effective communication.


## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, ExpressJS,Socket.I.O,Cloudinary






## Setup Front end
Download Files  
- Go to our github repository: https://github.com/Yadhukrishna007/fusion_fe

- Download Zip or clone repo

![App Screenshot](https://res.cloudinary.com/duxrswftp/image/upload/v1717736242/chatbot/35d40a3a-ae11-48f3-a665-3b1bc11de7c4.png)

- Either download the ZIP file and unpack it or clone with git

- Then open the folder in your favourite IDE
## Installation

- Install the App

```bash
  yarn install 

```



## Setup .env
```bash
REACT_APP_API_ENDPOINT=http://localhost:8000/api   //I have used this endpoint for my backend server, you can change it to your own server endpoint.

REACT_APP_SERVER_ENDPOINT=http://localhost:8000 

REACT_APP_CLOUD_NAME= u_r_cloud_name          //You can get this from your cloudinary account
REACT_APP_CLOUD_SECRET= your_cloud_secret     //You can get this from your cloudinary account
```




## Setup Backend
Download Files 
- Go to our github repository: https://github.com/Yadhukrishna007/fusion_be

- Download Zip or clone repo

![App Screenshot](https://res.cloudinary.com/duxrswftp/image/upload/v1717737524/chatbot/d39cb1af-d660-4185-9bf1-7ff93c13b846.png)

- Either download the ZIP file and unpack it or clone with git

- Then open the folder in your favourite IDE
## Installation

- Install the App

```bash
  yarn install 

```




## Setup .env
```bash
PORT=8000

DATABASE_NODE_URL= //your database url

ACCESS_TOKEN_SECRET=aKzdsPgY5g4G     //generate your own secret key

REFRESH_TOKEN_SECRET=LpwfLQ4PTYbu    //generate your own secret key

CLIENT_ENDPOINT=http://localhost:3000 


```





## Run Fusion backend


```bash
  npm run dev  

```

- Runs the app in the development mode.
Go to http://localhost:8000/api/test.    If the page returns
```bash
{
"title": "Express Testing",
"message": "The app is working properly!"
}
```
Then you have successfully setup the server



## Setup Backend
Download Files 
- Go to our github repository: https://github.com/Yadhukrishna007/fusion_be

- Download Zip or clone repo

![App Screenshot](https://res.cloudinary.com/duxrswftp/image/upload/v1717737524/chatbot/d39cb1af-d660-4185-9bf1-7ff93c13b846.png)

- Either download the ZIP file and unpack it or clone with git

- Then open the folder in your favourite IDE
## Run Fusion Frontend


```bash
  npm start  

```

- Runs the app in the development mode.

- Open http://localhost:3000 to view it in the browser.
