pipeline {
    agent any

    environment {
        APP_NAME = "REKASTAFF-Web-Apps-Landing-Page"
        COMPOSE_FILE = "docker-compose.yml"
        CONTAINER_NAME = "REKASTAFF-Web-Apps-Landing-Page"
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

        stage('Stop Old Containers') {
            steps {
                sh '''
                    docker stop REKASTAFF-Web-Apps-Landing-Page
                '''
            }
        }


        stage('Build Image') {
            steps {
                echo "🏗 Build Docker image (no cache)"
                sh '''
                    set -x
                    docker compose build --no-cache
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker compose up -d --force-recreate --remove-orphans
                '''
            }
        }


        stage('Verify') {
            steps {
                sh '''
                    docker ps | grep REKASTAFF-Web-Apps-Landing-Page
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
        }
    }
}
