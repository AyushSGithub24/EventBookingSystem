# Event Booking Backend

This is a backend API for an event booking application built using:

* TypeScript
* Express.js
* PostgreSQL
* Prisma ORM
* JWT (JSON Web Tokens)
* bcrypt (password hashing)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js
* PostgreSQL
* npm 

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AyushSGithub24/EventBookingSystem.git
   cd EventBookingSystem
   ```
   
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env file at the root with the following environment variables:

   ```env
   DATABASE_URL="your-postgresql-connection-string"
   PORT="3000"
   JWT_SECRET="MainNahiBatunga"
   ```

4. Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

5. Run database migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

## API Endpoints

The API has three primary modules: Auth, Events, and Bookings.

---

### Auth Routes
| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/auth/signup` | Register a user | Public |
| POST | `/auth/login` | Login and get JWT token | Public |


#### POST /v1/auth/signup

Request Body:

```json
{
    
    "email":"Ayush2005@gmail.com",
    "password":"Ayush@123",
    "role":"ADMIN",
    "name":"Ayush"
}

```

Response:

```json
{
    "message": "User created successfully",
    "newUser": {
        "id": "66a30529-08db-43e2-bce4-5c4a3dc8e904",
        "email": "Ayush2005@gmail.com",
        "name": "Ayush",
        "role": "ADMIN",
        "createdAt": "2025-05-28T05:41:35.031Z",
        "updatedAt": "2025-05-28T05:41:35.031Z"
    }
}
```

#### POST /v1/auth/login

Request Body:

```json
{
    "email":"Ayush2005@gmail.com",
    "password":"Ayush@123"
}
```

Response:

```json
{
    "message": "User Login Succesfully ",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmEzMDUyOS0wOGRiLTQzZTItYmNlNC01YzRhM2RjOGU5MDQiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDg0MTEwNDgsImV4cCI6MTc0ODQxNDY0OH0.787PMKlslnh583BAXLzQ5e3ZLlEvO0Wi9QLEHOPpmdY"
}
```

---

### Event Routes

Base URL: `/v1/events`
| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/events` | List all events | Public |
| GET | `/events/:id` | Get event details by ID | Public |
| POST | `/events` | Create a new event | Admin only |
| PUT | `/events/:id` | Update an event | Admin only |
| DELETE | `/events/:id` | Delete an event | Admin only |

#### GET /v1/events

Response:

```json
{
    "message": "Event fetched Succesfully ",
    "events": [
        {
            "id": "0bf37ba6-75f1-449b-bf8d-67e1a132c4a4",
            "title": "Full-Stack Developer Bootcamp",
            "description": "A 5-day intensive bootcamp covering modern web development with React, Node.js, and databases.",
            "dateTime": "2025-07-05T09:00:00.000Z",
            "location": "IIT Delhi, Seminar Hall",
            "totalSeats": 100,
            "availableSeats": 100,
            "createdById": "4ce36348-1d11-451a-bde3-a6ed32038ed0",
            "createdAt": "2025-05-27T17:33:52.911Z",
            "updatedAt": "2025-05-27T17:33:52.911Z"
        },
        {
            "id": "62506189-8072-41fc-ab17-94116ecc4ed3",
            "title": "Mind & Body Wellness Retreat",
            "description": "A weekend retreat focused on mindfulness, yoga, and healthy living in the hills.",
            "dateTime": "2025-10-12T06:00:00.000Z",
            "location": "Rishikesh Nature Resort",
            "totalSeats": 40,
            "availableSeats": 40,
            "createdById": "4ce36348-1d11-451a-bde3-a6ed32038ed0",
            "createdAt": "2025-05-27T17:34:10.414Z",
            "updatedAt": "2025-05-27T17:34:10.414Z"
        },
        ...  ]
}
```

#### GET /v1/events/:eventId

Response:

```json
{
    "message": "Event fetched Succesfully ",
    "event": {
        "id": "c3f2cd5a-eb35-4392-9221-2f2ba8d83143",
        "title": "UI/UX Product Design Workshop",
        "description": "A hands-on workshop for aspiring designers to learn Figma, prototyping, and design thinking.",
        "dateTime": "2025-08-22T11:30:00.000Z",
        "location": "WeWork Koramangala, Bangalore",
        "totalSeats": 60,
        "availableSeats": 60,
        "createdById": "4ce36348-1d11-451a-bde3-a6ed32038ed0",
        "createdAt": "2025-05-27T17:34:22.900Z",
        "updatedAt": "2025-05-27T17:34:22.900Z"
    }
}
```



#### POST /v1/events   #admin only

Request headers:
<br>
Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmEzMDUyOS0wOGRiLTQzZTItYmNlNC01YzRhM2RjOGU5MDQiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDg0MTEwNDgsImV4cCI6MTc0ODQxNDY0OH0.787PMKlslnh583BAXLzQ5e3ZLlEvO0Wi9QLEHOPpmdY

Request Body:

```json

{
            "title": "JAVA Developer Bootcamp",
            "description": "A 5-day intensive bootcamp covering modern web development with React, JAVA, and databases.",
            "dateTime": "2025-07-05T09:00:00.000Z",
            "location": "IIT Delhi, Seminar Hall",
            "totalSeats": 100,
            "availableSeats": 100
}

```

Response:

```json
{
    "message": "Event created succesfully ",
    "newEvent": {
        "id": "c7cff4db-3838-4b3b-8273-68ea567e356b",
        "title": "JAVA Developer Bootcamp",
        "description": "A 5-day intensive bootcamp covering modern web development with React, JAVA, and databases.",
        "dateTime": "2025-07-05T09:00:00.000Z",
        "location": "IIT Delhi, Seminar Hall",
        "totalSeats": 100,
        "availableSeats": 100,
        "createdById": "66a30529-08db-43e2-bce4-5c4a3dc8e904",
        "createdAt": "2025-05-28T05:50:25.661Z",
        "updatedAt": "2025-05-28T05:50:25.661Z"
    }
}


```

#### PUT /v1/events/:eventId    #admin only

Request headers:
<br>
Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmEzMDUyOS0wOGRiLTQzZTItYmNlNC01YzRhM2RjOGU5MDQiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDg0MTEwNDgsImV4cCI6MTc0ODQxNDY0OH0.787PMKlslnh583BAXLzQ5e3ZLlEvO0Wi9QLEHOPpmdY

Request Body:

```json

{          
    "totalSeats": 150
}

```
Response:

```json
{
    "message": "Event updated succesfully ",
    "updateEvent": {
        "id": "c7cff4db-3838-4b3b-8273-68ea567e356b",
        "title": "JAVA Developer Bootcamp",
        "description": "A 5-day intensive bootcamp covering modern web development with React, JAVA, and databases.",
        "dateTime": "2025-07-05T09:00:00.000Z",
        "location": "IIT Delhi, Seminar Hall",
        "totalSeats": 150,
        "availableSeats": 150,
        "createdById": "66a30529-08db-43e2-bce4-5c4a3dc8e904",
        "createdAt": "2025-05-28T05:50:25.661Z",
        "updatedAt": "2025-05-28T05:56:23.292Z"
    }
}


```

#### DELETE /v1/events/:eventId    #admin only

Request headers:
<br>
Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmEzMDUyOS0wOGRiLTQzZTItYmNlNC01YzRhM2RjOGU5MDQiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDg0MTEwNDgsImV4cCI6MTc0ODQxNDY0OH0.787PMKlslnh583BAXLzQ5e3ZLlEvO0Wi9QLEHOPpmdY

Response:

```json
{
    "message": "Event Deleted succesfully "
}
```


---

### Booking Routes

Base URL: `/v1/bookings`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/bookings/:eventId` | Book a ticket for an event | Authenticated |
| GET | `/bookings/me` | View logged-in user's bookings | Authenticated |
| DELETE | `/bookings/:bookingId` | Cancel a booking | Authenticated |



#### POST /v1/bookings/:eventId

Request Body:

```json
{
    "seats":2   
}
```

Response:

```json
{
    "message": "Booking successful",
    "booking": {
        "id": "257fb4f3-f825-4737-a603-92956e998628",
        "userId": "66a30529-08db-43e2-bce4-5c4a3dc8e904",
        "eventId": "62506189-8072-41fc-ab17-94116ecc4ed3",
        "seats": 2,
        "createdAt": "2025-05-28T06:13:30.442Z"
    }
}
```

#### DELETE /v1/bookings/:bookingId
Response:

```json
{
    "message": "Booking deleted successfully",
    "booking": {
        "id": "257fb4f3-f825-4737-a603-92956e998628",
        "userId": "66a30529-08db-43e2-bce4-5c4a3dc8e904",
        "eventId": "62506189-8072-41fc-ab17-94116ecc4ed3",
        "seats": 2,
        "createdAt": "2025-05-28T06:13:30.442Z",
        "event": {
            "id": "62506189-8072-41fc-ab17-94116ecc4ed3",
            "title": "Mind & Body Wellness Retreat",
            "description": "A weekend retreat focused on mindfulness, yoga, and healthy living in the hills.",
            "dateTime": "2025-10-12T06:00:00.000Z",
            "location": "Rishikesh Nature Resort",
            "totalSeats": 40,
            "availableSeats": 38,
            "createdById": "4ce36348-1d11-451a-bde3-a6ed32038ed0",
            "createdAt": "2025-05-27T17:34:10.414Z",
            "updatedAt": "2025-05-28T06:13:30.617Z"
        }
    }
}
```
#### GET /v1/bookings/me
```json
{
    "bookings": [
        {
            "id": "7c5a6e52-69a2-4c77-85a3-1f3b1bd950b0",
            "userId": "66a30529-08db-43e2-bce4-5c4a3dc8e904",
            "eventId": "62506189-8072-41fc-ab17-94116ecc4ed3",
            "seats": 2,
            "createdAt": "2025-05-28T06:18:37.806Z",
            "event": {
                "id": "62506189-8072-41fc-ab17-94116ecc4ed3",
                "title": "Mind & Body Wellness Retreat",
                "description": "A weekend retreat focused on mindfulness, yoga, and healthy living in the hills.",
                "dateTime": "2025-10-12T06:00:00.000Z",
                "location": "Rishikesh Nature Resort",
                "totalSeats": 40,
                "availableSeats": 38,
                "createdById": "4ce36348-1d11-451a-bde3-a6ed32038ed0",
                "createdAt": "2025-05-27T17:34:10.414Z",
                "updatedAt": "2025-05-28T06:18:37.960Z"
            }
        }
    ]
}
```

---


