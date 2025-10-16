pipeline {
    agent any
    environment {
        DB_USERNAME = credentials('db-admin-user')
        DB_PASSWORD = credentials('db-admin-password')
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'mkdir -p apps/backend/secrets'
                sh 'echo ${DB_USERNAME} > apps/backend/secrets/DB_USERNAME.txt'
                sh 'echo ${DB_PASSWORD} > apps/backend/secrets/DB_PASSWORD.txt'
            }
        }
        stage('Build') {
            steps {
                echo 'Building the project...'
                sh 'docker compose -f compose.prod.yml build'
            }
        }
        stage('Test') {
            steps {
                echo 'To be implemented'
            }
        }
        stage('Deploy') {
            steps {
                echo 'To be implemented'
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}