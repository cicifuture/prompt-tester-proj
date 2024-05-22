# Completion progress
User Story	Acceptance Criteria	Completion	  Comments
1.1	1.1.1	Completed	
	1.1.2	Completed	
	1.1.3	Completed	
1.2	1.2.1	Completed	
	1.2.2	Completed	
1.3	1.3.1	Completed	
	1.3.2	Completed	
2.1	2.1.1	Completed	
    2.1.2	Completed	
	2.1.3	Completed	
2.2	2.2.1	Completed	
    2.2.2	Completed	
	2.2.3	Completed
    2.2.4	Completed
3.1	3.1.1	Completed	
	3.1.2	Completed	
	3.1.3	Completed
4.1	4.1.1	Completed	
	4.1.2	Completed
    4.1.3   Completed	
5.1	5.1.1	not Completed	
	5.1.2	not Completed
    5.1.3   not Completed
    5.1.4   not Completed	


			
# Tech Stack
- Typescript, ReactJS, NextJS
- Python, FastAPI
- UI: shadcn
- LLM provider: OpenAI SDK



# Setup Process
Frontend: 
```
cd frontend
yarn install
yarn dev
```
backend: 
```
cd backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```
Create a .env file and input your OpenAI API Key in the file

```bash
cp .env
```


# How To Run

Run local server:
```bash
uvicorn main:app --host 0.0.0.0 --port [port]
```


# References
fastapi

create-llama



