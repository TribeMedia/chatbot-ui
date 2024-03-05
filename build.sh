#!/bin/bash

docker buildx build -t gqadonis/chatbot-ui:v0.0.9 --push --platform=linux/amd64  .
