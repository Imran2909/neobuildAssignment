# resume parser api

this project is a resume parser api that extracts structured data from resume pdfs using **gemini ai** and stores it in a **mongodb database**. it also provides endpoints to search for resumes by name.

---

## features

- **parse resume pdfs**: extract structured data (name, email, education, experience, skills, summary) from resume pdfs.
- **store data in mongodb**: save parsed resume data in a mongodb database.
- **search resumes**: search for resumes by name (case-insensitive).
- **jwt authentication**: secure api endpoints using jwt authentication.

---

## prerequisites

before running the project, make sure you have the following installed:

1. **node.js**: download and install node.js from [here](https://nodejs.org/).
2. **mongodb**: set up a mongodb database. you can use a local instance or a cloud service like [mongodb atlas](https://www.mongodb.com/cloud/atlas).
3. **gemini api key**: get your gemini api key from [google ai studio](https://aistudio.google.com/).

---

## setup instructions

### 1. clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. install dependencies

run the following command to install all dependencies:

```bash
npm install
```

### 3. create a `.env` file

create a `.env` file in the root directory of the project and add the following environment variables:

```env
gemini_api_key=your_gemini_api_key_here
jwt_secret=your_jwt_secret_here
mongo_url=your_mongodb_url_here
```

- replace `your_gemini_api_key_here` with your gemini api key.
- replace `your_jwt_secret_here` with a secret key for jwt authentication.
- replace `your_mongodb_url_here` with your mongodb connection url.

### 4. run the project

start the server using the following command:

```bash
npm start
```

the server will start running on `http://localhost:8080`.

---

## api endpoints

### 1. **login**
- **endpoint**: `post /user/login`
- **description**: generate a jwt token for authentication.
- **request body**:
  ```json
  {
    "username": "naval.ravikant",
    "password": "05111974"
  }
  ```
- **response**:
  ```json
  {
    "jwt": "your_jwt_token_here"
  }
  ```

### 2. **add resume**
- **endpoint**: `post /resume/add`
- **description**: parse a resume pdf and store the data in the database.
- **headers**:
  - `authorization: bearer <jwt_token>`
- **request body**:
  ```json
  {
    "url": "https://www.dhli.in/uploaded_files/resumes/resume_3404.pdf"
  }
  ```
- **response**:
  ```json
  {
    "_id": "65f4c8e1b3f4a7d8e4f1b2c3",
    "name": "john doe",
    "email": "john.doe@example.com",
    "education": {
      "degree": "bachelor of science",
      "branch": "computer science",
      "institution": "university of example",
      "year": "2020"
    },
    "experience": [
      {
        "job_title": "software engineer",
        "company": "tech corp",
        "start_date": "2020-06",
        "end_date": "2022-12"
      }
    ],
    "skills": ["javascript", "node.js", "react"],
    "summary": "experienced software engineer with a focus on web development."
  }
  ```

### 3. **search resumes**
- **endpoint**: `get /resume/search`
- **description**: search for resumes by name (case-insensitive).
- **headers**:
  - `authorization: bearer <jwt_token>`
- **query parameters**:
  - `name`: the name to search for.
- **response**:
  ```json
  [
    {
      "_id": "65f4c8e1b3f4a7d8e4f1b2c3",
      "name": "john doe",
      "email": "john.doe@example.com",
      "education": {
        "degree": "bachelor of science",
        "branch": "computer science",
        "institution": "university of example",
        "year": "2020"
      },
      "experience": [
        {
          "job_title": "software engineer",
          "company": "tech corp",
          "start_date": "2020-06",
          "end_date": "2022-12"
        }
      ],
      "skills": ["javascript", "node.js", "react"],
      "summary": "experienced software engineer with a focus on web development."
    }
  ]
  ```

---

## testing the api

you can test the api using tools like **postman** or **curl**. make sure to:

1. generate a jwt token using the `/user/login` endpoint.
2. use the token in the `authorization` header for all other endpoints.

---

## folder structure

```
project-folder/
├── database/                # database models and connection
│   └── applicantmodel.js    # mongoose model for applicants
├── middleware/              # middleware functions
│   └── authmiddleware.js    # jwt authentication middleware
├── routes/                  # api routes
│   ├── resumeroute.js       # resume-related routes
│   └── userroute.js         # user-related routes
├── .env                     # environment variables
├── index.js                 # main server file
├── package.json             # project dependencies
└── readme.md                # project documentation
```

---

## troubleshooting

1. **invalid json format**:
   - ensure the resume pdf is properly formatted and contains valid data.
   - check the gemini api response for errors.

2. **jwt authentication failed**:
   - make sure you are passing the correct jwt token in the `authorization` header.
   - ensure the `jwt_secret` in the `.env` file matches the one used to generate the token.

3. **database connection failed**:
   - check the `mongo_url` in the `.env` file.
   - ensure your mongodb instance is running.

---

## license

this project is licensed under the mit license. see the [license file](license) for details.

---

## contact

for any questions or issues, please contact [your-email@example.com](mailto:your-email@example.com).

---

happy coding! 🚀