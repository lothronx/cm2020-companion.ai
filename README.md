# ASP Final Project

For UoL BSc in Computer Science CM2020 Agile Software Projects

Team: Team 46 (Tutor Group 5)

Authors: On On Tam (200151908), Yue Wu (210312838), Mohab Mohamed Metwally (210287617/1), Joseph Kinyodah (210193880)
## Running the project

### Backend:
Open a terminal and go to the server directory:
```bash
cd server
```

Create a python virtual environment:

For Mac: 
```bash
virtualenv -p python3.9 env
source env/bin/activate
```

For Windows: 
```bash
py -3 -m venv venv
venv\Scripts\activate
```
Please double check and make sure you are using the python virtual environment before proceeding.

Install the dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
python main.py
```
Open [http://127.0.0.1:5000/test](http://127.0.0.1:5000/test) with your browser to see the result.

### Frontend:
Open a new terminal:
```bash
cd client
```

Install the dependencies:
```bash
npm i
```

Run the server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
