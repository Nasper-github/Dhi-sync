#!/bin/bash
# 1. Create the backend structure based on the Vertical Slice architecture
echo "🚀 Scaffolding Project Sync Backend..."

mkdir -p backend/app/api/v1/endpoints
mkdir -p backend/app/core/brain/ingestion
mkdir -p backend/app/core/brain/reasoning
mkdir -p backend/app/services/vector_store
mkdir -p backend/app/services/graph_store
mkdir -p backend/app/models/dsd

# 2. Create requirements.txt
cat <<EOF > backend/requirements.txt
fastapi
uvicorn
python-multipart
pydantic
lxml
python-docx
pypdf
neo4j
openai
langgraph
python-dotenv
EOF

# 3. Create a basic .env template
if [ ! -f backend/.env ]; then
cat <<EOF > backend/.env
# Sync Environment Variables
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
OPENAI_API_KEY=
PINECONE_API_KEY=
EOF
fi

# 4. Create an empty __init__.py files for package recognition
touch backend/app/__init__.py
touch backend/app/api/__init__.py
touch backend/app/api/v1/__init__.py
touch backend/app/core/__init__.py
touch backend/app/core/brain/__init__.py

echo "✅ Backend directory structure created."