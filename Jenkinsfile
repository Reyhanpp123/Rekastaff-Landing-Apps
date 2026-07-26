pipeline {
    agent any

    environment {
        APP_NAME = "REKASTAFF-Landing-Page"
        COMPOSE_FILE = "docker-compose.yml"
        CONTAINER_NAME = "REKASTAFF-Landing-Page"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                echo "🏗 Building Docker Image..."
                sh '''
                    set -e
                    docker compose -f ${COMPOSE_FILE} build --no-cache
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo "🚀 Deploying Application..."
                sh '''
                    set -e

                    docker compose -f ${COMPOSE_FILE} down || true

                    docker compose -f ${COMPOSE_FILE} up -d \
                        --build \
                        --force-recreate \
                        --remove-orphans
                '''
            }
        }

        stage('Verify') {
            steps {
                echo "🔍 Verifying Container..."
                sh '''
                    docker ps --filter "name=${CONTAINER_NAME}"

                    docker inspect ${CONTAINER_NAME} >/dev/null
                '''
            }
        }

        stage('Cleanup') {
            steps {
                echo "🧹 Cleaning unused Docker images..."
                sh '''
                    docker image prune -f
                '''
            }
        }
    }

    post {
        success {
            echo "✅ DEPLOY SUCCESS"
        }

        failure {
            echo "❌ DEPLOY FAILED"

            sh '''
                docker compose -f ${COMPOSE_FILE} logs --tail=100 || true
            '''
        }
    }
}