# Bitespeed

To run this project locally:

1. Clone the repo
2. Run `npm install` to install the dependencies
3. Create a `.env` file in the root directory
4. Add the PostgreSQL database URI and the port number in the `.env` file as mentioned in the `.env.example` file
5. Run `npm start`

Test this in prod: [Bitespeed Production](https://bitespeed-production-a2c1.up.railway.app/)

API's:

1. **Identify API**

   - Endpoint: `https://bitespeed-production-a2c1.up.railway.app/identify`
   - Method: POST
   - JSON Body: `{ "email": "xyz", "phoneNumber": "123"}`
   - Return format:
     ```json
     {
       "contact": {
         "primaryContatctId": 11,
         "emails": ["george@hillvalley.edu", "biffsucks@hillvalley.edu"],
         "phoneNumbers": ["919191", "717171"],
         "secondaryContactIds": [27]
       }
     }
     ```
