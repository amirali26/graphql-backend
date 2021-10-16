FROM node:14

WORKDIR /usr/src/app

USER root

# Copy package.json and package-lock.json
COPY package.json ./

# Installing AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

# Install npm production packages 
RUN AWS_ACCESS_KEY_ID=AKIAWWKAWVFUS2BME5HG AWS_SECRET_ACCESS_KEY=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 aws codeartifact login --tool npm --repository helpmycase --domain helpmycase --domain-owner 460234074473 --region eu-west-1
RUN npm install

# COPY source code
COPY . .

# ENV NODE_ENV production
ENV PORT 8080

EXPOSE 8080

CMD ["npm", "run", "build"]