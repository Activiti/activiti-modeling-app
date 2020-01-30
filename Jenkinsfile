pipeline {
    options {
        disableConcurrentBuilds()
        quietPeriod(45)
    }
     agent {
        label "jenkins-nodejs"
    }
    environment {
      ORG               = 'activiti'
      APP_NAME          = 'activiti-modeling-app'
      CHARTMUSEUM_CREDS = credentials('jenkins-x-chartmuseum')
      GITHUB_CHARTS_REPO    = "https://github.com/Activiti/activiti-cloud-helm-charts.git"
      GITHUB_HELM_REPO_URL = "https://activiti.github.io/activiti-cloud-helm-charts/"
      PREVIEW_VERSION = "0.0.0-SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER"
      NODE_OPTIONS = "--max_old_space_size=3000"
      OPTIMIZE_MEMORY = "true"
      E2E_FAIL_FAST = "true"
    }
    stages {
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
            // For some reason Jenkins are not able to run postinstall as part of the install??
            sh "npm run postinstall"
            sh "npm install @alfresco/adf-cli@alpha"
            sh "./node_modules/@alfresco/adf-cli/bin/adf-cli update-commit-sha --pointer \"HEAD\" --pathPackage \"\$(pwd)\""
            sh "npm run build prod"

            dir("./charts/$APP_NAME") {
              retry(5) {
                sh "make tag"
              }
            }
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
            container('nodejs') {
                // Run updatebot to update other repos
                sh './updatebot.sh'
            }
          }

      }
    }
    post {
        failure {
           slackSend(
             channel: "#activiti-community-builds",
             color: "danger",
             message: "activiti-modeling-app branch=$BRANCH_NAME is failed http://jenkins.jx.35.228.195.195.nip.io/job/Activiti/job/activiti-modeling-app/"
           )
        }
        always {
            cleanWs()
        }
    }
}
