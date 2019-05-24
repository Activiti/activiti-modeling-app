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
      PREVIEW_VERSION = "0.0.0-SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER"
      NODE_OPTIONS = "--max_old_space_size=40000"
      OPTIMIZE_MEMORY = "true"
        
      API_HOST="http://activiti-cloud-gateway.jx-staging.35.228.195.195.nip.io/activiti-cloud-modeling-backend"
      OAUTH_HOST="http://activiti-cloud-gateway.jx-staging.35.228.195.195.nip.io/auth/realms/activiti"
      E2E_HOST="http://localhost"
      E2E_PORT="4100"
      E2E_USERNAME="modeler"
      E2E_PASSWORD="password"
      E2E_UNAUTHORIZED_USER="hruser"
      E2E_UNAUTHORIZED_USER_PASSWORD="password"
      E2E_FAIL_FAST="true"
      BROWSER_RUN="true"
      SAVE_SCREENSHOT="false"
      SCREENSHOT_URL=""
      SCREENSHOT_USERNAME=""
      SCREENSHOT_PASSWORD="" 
        
      DISPLAY=":99.0"
        
    }
    stages {
      stage('CI Build and push snapshot') {
        when {
          branch 'PR-*'
        }
        steps {
          container('nodejs') {
            sh "node --version"  
            sh "npm --version" 

            sh "Xvfb :99 &"
            sh "sleep 3"  
            sh "chown root /opt/google/chrome/chrome-sandbox"
            sh "chmod 4755 /opt/google/chrome/chrome-sandbox"  
            sh "npm ci"
              
            sh "npm install"
            //sh "npm run build"
            //sh "npm run lint && npm run test:ci && npm run package:sdk && npm run build:prod" 
            sh "npm run e2e"
              
            //sh "npm test"
            //sh 'export VERSION=$PREVIEW_VERSION && skaffold build -f skaffold.yaml'

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
            sh "npm run build:prod"
            //sh "npm test"
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
        always {
            cleanWs()
        }
    }
}
