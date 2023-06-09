# Face Recognizer

## Description

## Use

### Installation

```bash
sh setup.sh
```

### Initialization

1. Start the Database

```bash
docker run -p 5432:5432 --env-file db.env -v ./data:/var/lib/postgresql/data -d postgres 
```

2. Start the model

```bash
docker run -p 8000:8000 --env-file ./model/.env -d project/model
```

3. Start the backend

```bash
docker run -p 8007:8007 --env-file ./backend/.env -e DATABASE_URL=postgresql://admin:admin@host.docker.internal:5432/postgres?schema=public -e MODEL_URL=http://host.docker.internal:8000 -d project/backend
```

3. Start the frontend

```bash
docker run -p 4173:4173 --env-file ./frontend/.env -d project/frontend
```

