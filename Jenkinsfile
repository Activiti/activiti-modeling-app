     //  sh "updatebot push-regex -r "\s+tag: (.*)" -v \$(cat VERSION) --previous-line "\s+repository: activiti/activiti-model" **/values.yaml) --merge false"
 pipeline {
    agent {
        label "jenkins-nodejs"
    }
    environment {
      ORG               = 'activiti'
      APP_NAME          = 'activiti-modeling-app'
      CHARTMUSEUM_CREDS = credentials('jenkins-x-chartmuseum')
      GITHUB_CHARTS_REPO    = "https://github.com/Activiti/activiti-cloud-helm-charts.git"
      GITHUB_HELM_REPO_URL = "https://activiti.github.io/activiti-cloud-helm-charts/"
    }
    stages {
      stage('CI Build and push snapshot') {
        when {
          branch 'PR-*'
        }
        steps {
          container('nodejs') {
            sh "npm install"
            sh "npm run build"
            sh "npm test"
            sh 'export VERSION=$PREVIEW_VERSION && skaffold build -f skaffold.yaml'

          }
        }
      }
      stage('Build Release') {
        when {
          branch 'master'
        }
        steps {
          container('nodejs') {
            // ensure we're not on a detached head
            sh "git checkout master"
            sh "git config --global credential.helper store"

            sh "jx step git credentials"
            // so we can retrieve the version in later steps
            sh "echo \$(jx-release-version) > VERSION"
            sh "npm install"
            sh "npm run build"
            sh "npm test"

            sh 'export VERSION=`cat VERSION` && skaffold build -f skaffold.yaml'
            sh "jx step post build --image $DOCKER_REGISTRY/$ORG/$APP_NAME:\$(cat VERSION)"

          }
        }
      }
      stage('Promote') {
        when {
          branch 'master'
        }
        steps {
            // Run updatebot to update other repos
            sh './updatebot.sh'
          }

      }
    }
    post {
        always {
            cleanWs()
        }
    }
}
