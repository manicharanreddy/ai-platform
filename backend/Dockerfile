FROM node:18-alpine

# Install Python and other build dependencies
RUN apk add --update \
    python3 \
    py3-pip \
    python3-dev \
    build-base \
    bash

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY python_requirements.txt ./

# Install Node.js dependencies
RUN npm install

# Install Python dependencies
RUN pip3 install --upgrade pip
RUN pip3 install -r python_requirements.txt

# Download NLTK data and spaCy model
RUN python3 -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('omw-1.4')"
RUN python3 -m spacy download en_core_web_sm

# Create uploads directory
RUN mkdir -p uploads

# Copy the rest of the application
COPY . .

EXPOSE 5000

CMD ["npm", "start"]