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
        

      API_HOST="http://activiti-cloud-gateway.jx-staging.35.228.195.195.nip.io/modeling-service/"
      OAUTH_HOST="http://activiti-cloud-gateway.jx-staging.35.228.195.195.nip.io/auth/realms/activiti"
      E2E_HOST="http://localhost"
      E2E_PORT="4100"

      BROWSER_RUN="false"
      SAVE_SCREENSHOT="true"
        
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
              
            sh "npm run e2e"
              
            //sh "npm test"
            //sh 'export VERSION=$PREVIEW_VERSION && skaffold build -f skaffold.yaml'
            sh "echo  API_HOST=$API_HOST"
            sh "echo OAUTH_HOST=$OAUTH_HOST"
            sh  "echo E2E_HOST=E2E_HOST"
            sh "echo E2E_PORT=$E2E_PORT"
            sh "echo E2E_USERNAME=$E2E_USERNAME"
            sh "echo E2E_PASSWORD=$E2E_PASSWORD"
            sh "echo E2E_UNAUTHORIZED_USER=$E2E_UNAUTHORIZED_USER"
            sh "echo E2E_UNAUTHORIZED_USER_PASSWORD=$E2E_UNAUTHORIZED_USER_PASSWORD"
            sh "echo BROWSER_RUN=$BROWSER_RUN"
            sh "echo SAVE_SCREENSHOT=$SAVE_SCREENSHOT"
            sh "echo SCREENSHOT_URL=$SCREENSHOT_URL"
            sh "echo SCREENSHOT_USERNAME=$SCREENSHOT_USERNAME"
            sh "echo SCREENSHOT_PASSWORD=SCREENSHOT_PASSWORD"


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
