docker run -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=postgres --volume=postgres:/var/lib/postgresql/data -p 5432:5432 -d postgres:13.2-alpine
cd model && uvicorn main:app --host 0.0.0.0 --port 8000 &
cd frontend && yarn build && yarn preview &
cd backend && yarn prisma db push && yarn build && yarn start
