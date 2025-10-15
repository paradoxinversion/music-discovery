pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                echo 'Building the project...'
                sh 'docker compose build -f docker-compose.prod.yml'
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