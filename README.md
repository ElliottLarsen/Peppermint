# Peppermint
## Technologies
- Python
- FastAPI
## Setup Guide
- Ensure that Python and Node are installed.
- Clone this repository.
- Backend Setup:
     - Navigate to the backend directory:
       ```
       cd backend
       ```
     - Install dependencies:
       ```
       pip3 install -r requirements.txt
       ```
     - Initialize Alembic:
       ```
       alembic init migrations
       ```
     - Update `alembic.ini`:
       ```
       sqlalchemy.url = sqlite:///./peppermint.db
       ```
     - Update `migrations/env.py`:
       ```python
       import models
       target_metadata = models.Base.metadata
       ```
     - Generate and apply migrations:
       ```
       alembic revision --autogenerate
       alembic upgrade head
       ```
     - Start the server:
       ```
       uvicorn main:app --reload
       ```
     - Explore the backend endpoints.
       ```
       localhost:8000/docs
       ```