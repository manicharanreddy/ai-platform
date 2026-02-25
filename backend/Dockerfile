FROM node:18-bullseye

# Install Python 3.9 and other build dependencies (compatible with PyTorch)
RUN apt-get update && apt-get install -y \
    python3.9 \
    python3-pip \
    python3-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create symbolic links for python3 and pip3
RUN ln -sf /usr/bin/python3.9 /usr/bin/python3 && \
    ln -sf /usr/bin/python3.9 /usr/bin/python && \
    ln -sf /usr/bin/pip3 /usr/bin/pip

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY python_requirements.txt ./

# Install Node.js dependencies
RUN npm install

# Upgrade pip and install Python dependencies
RUN pip3 install --upgrade pip setuptools wheel

# Install PyTorch first to handle compatibility
RUN pip3 install torch==2.0.1 torchvision==0.15.2 --index-url https://download.pytorch.org/whl/cpu

# Install remaining Python dependencies with error handling
RUN pip3 install --no-cache-dir -r python_requirements.txt || \
    (echo "Retrying with --only-binary=:all: flag" && \
     pip3 install --no-cache-dir --only-binary=:all: -r python_requirements.txt)

# Download NLTK data and spaCy model
RUN python3 -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('omw-1.4')"
RUN python3 -m spacy download en_core_web_sm

# Create uploads directory
RUN mkdir -p uploads

# Copy the rest of the application
COPY . .

EXPOSE 5000

CMD ["npm", "start"]